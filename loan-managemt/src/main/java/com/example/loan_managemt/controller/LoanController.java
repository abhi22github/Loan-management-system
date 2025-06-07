package com.example.loan_managemt.controller;

import com.example.loan_managemt.entity.Loan;
import com.example.loan_managemt.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    @Autowired
    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    public ResponseEntity<Loan> createLoan(@RequestBody Loan loan) {
        Loan createdLoan = loanService.createLoan(loan);
        return new ResponseEntity<>(createdLoan, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans() {
        List<Loan> loans = loanService.getAllLoans();
        return new ResponseEntity<>(loans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id) {
        try {
            Loan loan = loanService.getLoanbyId(id);
            return new ResponseEntity<>(loan, HttpStatus.OK);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<Void> recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        try {
            if (!payload.containsKey("amount") || payload.get("amount") == null ||
                    !payload.containsKey("paymentDate") || payload.get("paymentDate") == null) {
                throw new IllegalArgumentException("Missing 'amount' or 'paymentDate' in payment request.");
            }

            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            LocalDate paymentDate = LocalDate.parse(payload.get("paymentDate").toString());

            loanService.recordpayment(id, amount, paymentDate);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format for 'paymentDate'. Please use YYYY-MM-DD.");
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Loan not found")) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
            } else if (e.getMessage() != null && e.getMessage().contains("already paid")) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + e.getMessage());
        }
    }
}