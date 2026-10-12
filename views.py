import logging
from django.shortcuts import render
from django.contrib import messages
from .models import Fruit, Student

# Logger setup for Task 8.3 (Server log verification)
logger = logging.getLogger(__name__)

def dashboard_view(request):
    # Task 7.3: Simple user search input form screening
    search_query = request.GET.get('q', '')
    if search_query:
        fruits = Fruit.objects.filter(name__icontains=search_query)
        students = Student.objects.filter(name__icontains=search_query)
    else:
        fruits = Fruit.objects.all()
        students = Student.objects.all()

    # Task 8.2: Dynamic table sorting tools (e.g., sort by student name)
    sort_by = request.GET.get('sort', 'name')
    if sort_by in ['name', 'enrollment_id', 'course']:
        students = students.order_by(sort_by)

    context = {
        'fruits': fruits,
        'selected_event_students': students,
        'active_page': 'dashboard', # Task 8.1: Structural active utility highlight marker
    }
    return render(request, 'app/dashboard.html', context)

def about_view(request):
    return render(request, 'app/about.html', {'active_page': 'about'})

def contact_view(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_text = request.POST.get('message')

        # Task 8.3: Forward verified feedback text parameters directly into server logs
        logger.info(f"Contact Form Submission - Name: {name}, Email: {email}, Message: {message_text}")
        
        # Task 8.2: Persistent user message feedback notification box
        messages.success(request, 'Thank you! Your feedback has been successfully recorded.')

    return render(request, 'app/contact.html', {'active_page': 'contact'})