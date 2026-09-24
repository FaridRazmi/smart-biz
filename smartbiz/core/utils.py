from functools import wraps
from django.shortcuts import redirect
from django.utils import timezone
from .models import Product


def subscription_required(view_func):
    """
    Previously gated by subscription. Now subscription requirements have been removed.
    Simply ensures the user is logged in.
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("login")
        return view_func(request, *args, **kwargs)

    return _wrapped_view


def get_notifications(request):
    """Get stock alerts and operational notifications for current merchant"""
    notifications = []
    
    if not request.user.is_authenticated:
        return notifications
    
    # Check for low stock products
    low_stock_products = Product.objects.filter(
        user=request.user,
        quantity__lt=10,
        quantity__gt=0
    ).count()
    
    if low_stock_products > 0:
        notifications.append({
            "type": "warning",
            "message": f"{low_stock_products} product(s) are running low on stock (< 10 units left)."
        })
    
    # Check for out of stock products
    out_of_stock = Product.objects.filter(
        user=request.user,
        quantity=0
    ).count()
    
    if out_of_stock > 0:
        notifications.append({
            "type": "danger",
            "message": f"{out_of_stock} product(s) are completely out of stock."
        })
    
    return notifications
