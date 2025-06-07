package com.example.loan_managemt.repository;

import com.example.loan_managemt.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan,Long> {
}
