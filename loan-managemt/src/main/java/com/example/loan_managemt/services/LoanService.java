package com.example.loan_managemt.services;

import com.example.loan_managemt.entity.Loan;
import com.example.loan_managemt.entity.Payment;
import com.example.loan_managemt.repository.LoanRepository;
import com.example.loan_managemt.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    public Loan createLoan(Loan loan){
        loan.setStatus("ACTIVE");
        loan.setOutstandingPrincipal(loan.getPrincipalAmount());
        return loanRepository.save(loan);
    }
    public List<Loan> getAllLoans(){
        return loanRepository.findAll();
    }
    public Loan getLoanbyId(Long id){
        return loanRepository.findById(id).orElseThrow(()->new RuntimeException("Loan not found with Id:"+id));
    }
    public void  recordpayment(Long id, BigDecimal amount, LocalDate paymentDate){
        Loan loan = getLoanbyId(id);
        Payment payment = new Payment();
        payment.setAmountPaid(amount);
        payment.setPaymentDate(paymentDate);
        payment.setLoan(loan);

        BigDecimal updatedOutstanding = loan.getOutstandingPrincipal().subtract(amount);
        loan.setOutstandingPrincipal(updatedOutstanding);

        if (updatedOutstanding.compareTo(BigDecimal.ZERO) <= 0) {
            loan.setStatus("PAID");
        }

        paymentRepository.save(payment);
        loanRepository.save(loan);
    }
    }
