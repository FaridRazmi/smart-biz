import json
from datetime import timedelta
from functools import wraps

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .models import Product, Sale
from .utils import subscription_required


def landing_page(request):
    """Public landing page showcasing SmartBiz features with zero AI slop"""
    if request.user.is_authenticated:
        return redirect("dashboard")
    return render(request, "core/landing.html")


def register(request):
    """Register a new business merchant"""
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        password1 = request.POST.get("password1", "")
        password2 = request.POST.get("password2", "")

        if not username or not password1:
            return render(request, "core/register.html", {"error": "Username and password are required"})

        if password1 != password2:
            return render(request, "core/register.html", {"error": "Passwords do not match", "username": username, "email": email})

        if User.objects.filter(username=username).exists():
            return render(request, "core/register.html", {"error": "Username already exists", "email": email})

        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)
        return redirect("onboarding")

    return render(request, "core/register.html")


@login_required
def onboarding(request):
    """Simple 2-step onboarding to get started recording sales"""
    has_products = Product.objects.filter(user=request.user).exists()
    if has_products:
        return redirect("dashboard")
    return render(request, "core/onboarding.html")


@login_required
@subscription_required
def dashboard(request):
    today = timezone.now().date()
    seven_days_ago = today - timedelta(days=7)
    thirty_days_ago = today - timedelta(days=30)
    
    # Today's sales
    sales_today = Sale.objects.filter(user=request.user, created_at__date=today)
    total_today = sales_today.aggregate(Sum('total_price'))['total_price__sum'] or 0
    sales_count_today = sales_today.count()
    
    # This week's sales (last 7 days)
    sales_week = Sale.objects.filter(user=request.user, created_at__date__gte=seven_days_ago)
    total_week = sales_week.aggregate(Sum('total_price'))['total_price__sum'] or 0
    sales_count_week = sales_week.count()
    
    # This month's sales (last 30 days)
    sales_month = Sale.objects.filter(user=request.user, created_at__date__gte=thirty_days_ago)
    total_month = sales_month.aggregate(Sum('total_price'))['total_price__sum'] or 0
    
    # All time sales
    all_sales = Sale.objects.filter(user=request.user)
    total_all_time = all_sales.aggregate(Sum('total_price'))['total_price__sum'] or 0
    all_time_transactions = all_sales.count()
    
    # Recent 6 transactions
    recent_sales = all_sales.select_related('product').order_by('-created_at')[:6]
    
    # Products metrics
    products = Product.objects.filter(user=request.user)
    total_products_count = products.count()
    low_stock_count = products.filter(quantity__lt=10, quantity__gt=0).count()
    out_of_stock = products.filter(quantity=0).count()
    in_stock_count = total_products_count - low_stock_count - out_of_stock
    
    # Top selling products
    top_products = Sale.objects.filter(user=request.user).values('product__name').annotate(
        total_sold=Sum('quantity_sold'),
        revenue=Sum('total_price')
    ).order_by('-revenue')[:5]
    
    # Daily sales data for 7-day visual trend
    daily_sales = []
    max_day_val = 1
    for i in range(7):
        date = today - timedelta(days=6-i)
        day_total = Sale.objects.filter(
            user=request.user,
            created_at__date=date
        ).aggregate(Sum('total_price'))['total_price__sum'] or 0
        if day_total > max_day_val:
            max_day_val = day_total
        daily_sales.append({
            "day": date.strftime('%a'),
            "date": date.strftime('%b %d'),
            "total": int(day_total),
        })

    # Normalized height percentage for CSS/SVG rendering
    for d in daily_sales:
        d["height_percent"] = max(8, int((d["total"] / max_day_val) * 100)) if max_day_val > 0 else 8

    avg_sale_value = total_week / sales_count_week if sales_count_week > 0 else 0
    
    context = {
        "sales_today": sales_today,
        "total_today": int(total_today),
        "total_week": int(total_week),
        "total_month": int(total_month),
        "total_all_time": int(total_all_time),
        "all_time_transactions": all_time_transactions,
        "products": products,
        "total_products_count": total_products_count,
        "low_stock_count": low_stock_count,
        "out_of_stock": out_of_stock,
        "in_stock_count": in_stock_count,
        "top_products": top_products,
        "recent_sales": recent_sales,
        "daily_sales": daily_sales,
        "daily_sales_json": json.dumps(daily_sales, cls=DjangoJSONEncoder),
        "sales_count_today": sales_count_today,
        "sales_count_week": sales_count_week,
        "avg_sale_value": int(avg_sale_value),
    }
    return render(request, "core/dashboard.html", context)


@login_required
@subscription_required
def product_list(request):
    """Display and search inventory items"""
    query = request.GET.get('q', '').strip()
    stock_status = request.GET.get('status', 'all')
    
    products = Product.objects.filter(user=request.user)
    
    if query:
        products = products.filter(name__icontains=query)
        
    if stock_status == 'low':
        products = products.filter(quantity__lt=10, quantity__gt=0)
    elif stock_status == 'out':
        products = products.filter(quantity=0)
    elif stock_status == 'in_stock':
        products = products.filter(quantity__gte=10)
        
    products = products.order_by('name')
    
    # Inventory summaries
    all_user_products = Product.objects.filter(user=request.user)
    total_inventory_items = all_user_products.count()
    low_stock_count = all_user_products.filter(quantity__lt=10, quantity__gt=0).count()
    out_of_stock_count = all_user_products.filter(quantity=0).count()
    
    # Estimated inventory asset value
    total_inventory_value = sum(p.quantity * (p.buying_price or 0) for p in all_user_products)

    context = {
        "products": products,
        "query": query,
        "stock_status": stock_status,
        "total_inventory_items": total_inventory_items,
        "low_stock_count": low_stock_count,
        "out_of_stock_count": out_of_stock_count,
        "total_inventory_value": int(total_inventory_value),
    }
    return render(request, "core/product_list.html", context)


@login_required
@subscription_required
def product_create(request):
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        quantity = request.POST.get("quantity", "0")
        buying_price = request.POST.get("buying_price", "0")
        selling_price = request.POST.get("selling_price", "0")

        if name:
            Product.objects.create(
                user=request.user,
                name=name,
                quantity=int(quantity or 0),
                buying_price=buying_price or 0,
                selling_price=selling_price or 0,
            )
            return redirect("product_list")

    return render(request, "core/product_form.html")


@login_required
@subscription_required
def product_edit(request, product_id):
    product = get_object_or_404(Product, id=product_id, user=request.user)

    if request.method == "POST":
        product.name = request.POST.get("name", "").strip()
        product.quantity = int(request.POST.get("quantity") or 0)
        product.buying_price = request.POST.get("buying_price") or 0
        product.selling_price = request.POST.get("selling_price") or 0
        if product.name:
            product.save()
        return redirect("product_list")

    return render(request, "core/product_form.html", {"product": product})


@login_required
@subscription_required
def product_delete(request, product_id):
    product = get_object_or_404(Product, id=product_id, user=request.user)

    if request.method == "POST":
        product.delete()
        return redirect("product_list")

    return render(request, "core/product_confirm_delete.html", {"product": product})


@login_required
@subscription_required
def record_sale(request, product_id):
    product = get_object_or_404(Product, id=product_id, user=request.user)

    if request.method == "POST":
        try:
            quantity_sold = int(request.POST.get("quantity_sold") or 0)
        except ValueError:
            quantity_sold = 0

        if 0 < quantity_sold <= product.quantity:
            total_price = quantity_sold * product.selling_price

            Sale.objects.create(
                user=request.user,
                product=product,
                quantity_sold=quantity_sold,
                total_price=total_price,
            )

            product.quantity -= quantity_sold
            product.save()

            return redirect("dashboard")
        else:
            return render(request, "core/record_sale.html", {
                "product": product,
                "error": f"Invalid quantity. You only have {product.quantity} units in stock."
            })

    return render(request, "core/record_sale.html", {"product": product})


@login_required
@subscription_required
def sales_history(request):
    sales = Sale.objects.filter(user=request.user).select_related('product').order_by("-created_at")
    total_sales_value = sales.aggregate(Sum('total_price'))['total_price__sum'] or 0
    total_units_sold = sales.aggregate(Sum('quantity_sold'))['quantity_sold__sum'] or 0

    return render(request, "core/sales_history.html", {
        "sales": sales,
        "total_sales_value": int(total_sales_value),
        "total_units_sold": total_units_sold,
        "transaction_count": sales.count(),
    })


# ========== REDIRECTS FOR REMOVED SUBSCRIPTION PAGES ==========

def subscription_plans(request, *args, **kwargs):
    return redirect("dashboard")


def renew_subscription(request, *args, **kwargs):
    return redirect("dashboard")


def subscription_status(request, *args, **kwargs):
    return redirect("dashboard")


def subscription_required_view(request, *args, **kwargs):
    return redirect("dashboard")


def subscription_expired_view(request, *args, **kwargs):
    return redirect("dashboard")


# ========== ADMIN VIEWS ==========

def admin_required(view_func):
    """Decorator to require admin/staff access"""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
            return redirect("login")
        return view_func(request, *args, **kwargs)
    return _wrapped_view


@login_required
@admin_required
def admin_dashboard(request):
    """Admin dashboard with merchant platform statistics"""
    business_owners = User.objects.filter(is_staff=False, is_superuser=False)
    total_users = business_owners.count()
    active_users = business_owners.filter(is_active=True).count()
    inactive_users = business_owners.filter(is_active=False).count()
    
    total_products = Product.objects.count()
    total_sales_count = Sale.objects.count()
    total_revenue = Sale.objects.aggregate(Sum('total_price'))['total_price__sum'] or 0

    recent_merchants = business_owners.order_by('-date_joined')[:6]

    context = {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "total_products": total_products,
        "total_sales_count": total_sales_count,
        "total_revenue": int(total_revenue),
        "recent_merchants": recent_merchants,
    }
    return render(request, "core/admin_dashboard.html", context)


@login_required
@admin_required
def admin_users(request):
    """Manage business owner accounts"""
    business_owners = User.objects.filter(is_staff=False, is_superuser=False).annotate(
        product_count=Count('product', distinct=True),
        sales_count=Count('sale', distinct=True),
        total_sales=Sum('sale__total_price')
    ).order_by('-date_joined')
    
    # Filter by status
    status_filter = request.GET.get('status', 'all')
    if status_filter == 'active':
        business_owners = business_owners.filter(is_active=True)
    elif status_filter == 'inactive':
        business_owners = business_owners.filter(is_active=False)

    context = {
        "users": business_owners,
        "status_filter": status_filter,
    }
    return render(request, "core/admin_users.html", context)


@login_required
@admin_required
def admin_subscriptions(request, *args, **kwargs):
    return redirect("admin_dashboard")


@login_required
@admin_required
def toggle_user_status(request, user_id):
    """Toggle user active status"""
    user = get_object_or_404(User, id=user_id, is_staff=False, is_superuser=False)
    
    if request.method == "POST":
        user.is_active = not user.is_active
        user.save()
        return redirect("admin_users")
    
    context = {"user": user}
    return render(request, "core/confirm_action.html", context)


@login_required
@admin_required
def toggle_subscription_status(request, subscription_id):
    return redirect("admin_dashboard")
