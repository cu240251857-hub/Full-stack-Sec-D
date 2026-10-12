from django.db import models

class Fruit(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    enrollment_id = models.CharField(max_length=50)
    course = models.CharField(max_length=100)

    def __str__(self):
        return self.name