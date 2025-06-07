package com.example.loan_managemt.repository;

import com.example.loan_managemt.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
}
