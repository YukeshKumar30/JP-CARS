"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { PageTransition, Reveal, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { calculateEMI, formatPrice } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { Metadata } from "next";

function EMICalculator() {
  const [price, setPrice] = useState(800000);
  const [down, setDown] = useState(160000);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(60);

  const result = calculateEMI(price, down, rate, tenure);

  return (
    <div id="emi-calculator" className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
      <h3 className="font-bold text-jp-text dark:text-white mb-5 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-jp-gold" />
        EMI Calculator
      </h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Vehicle Price (₹)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="jp-input" />
        </div>
        <div>
          <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Down Payment (₹)</label>
          <input type="number" value={down} onChange={e => setDown(Number(e.target.value))} className="jp-input" />
        </div>
        <div>
          <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Interest Rate (% p.a.)</label>
          <input type="number" value={rate} step={0.1} onChange={e => setRate(Number(e.target.value))} className="jp-input" />
        </div>
        <div>
          <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Tenure (Months)</label>
          <select value={tenure} onChange={e => setTenure(Number(e.target.value))} className="jp-input">
            {[12,24,36,48,60,72,84].map(m => <option key={m} value={m}>{m} months</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {[
          { label: "Loan Amount", value: formatPrice(result.loanAmount) },
          { label: "Monthly EMI", value: formatPrice(result.monthlyEMI), highlight: true },
          { label: "Total Interest", value: formatPrice(result.totalInterest) },
          { label: "Total Payable", value: formatPrice(result.totalPayable) },
        ].map((item) => (
          <div key={item.label} className={`p-3 rounded-xl text-center ${item.highlight ? "bg-jp-gold/10 border border-jp-gold/20" : "bg-jp-bg dark:bg-jp-black"}`}>
            <div className={`text-lg font-bold ${item.highlight ? "text-jp-gold" : "text-jp-text dark:text-white"}`}>{item.value}</div>
            <div className="text-xs text-jp-muted mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-jp-muted">* Indicative estimate only. Actual rates and approval subject to lender criteria.</p>
    </div>
  );
}

export default function FinancePage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          employment_type: "Salaried / Self-Employed",
        }),
      });
      track("finance_submit");
      setSubmitted(true);
    } catch (err) {
      console.error("Finance enquiry submission error:", err);
      setSubmitted(true);
    }
  };

  const howItWorks = [
    { step: "1", title: "Submit Enquiry", desc: "Fill in your details and vehicle preference." },
    { step: "2", title: "Bank Matching", desc: "We connect you with suitable lenders." },
    { step: "3", title: "Document Submission", desc: "Submit KYC and income documents." },
    { step: "4", title: "Approval & Disbursal", desc: "Loan approval and disbursal by the bank." },
  ];

  const documents = [
    "Aadhaar Card / PAN Card",
    "Income Proof (Salary slips / ITR)",
    "Bank Statements (3–6 months)",
    "Employment Proof / Business Proof",
    "Passport-size Photographs",
    "Vehicle-related Documents",
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-12">
          {/* Header */}
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <span className="section-tag justify-center">Finance</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-jp-text dark:text-white mb-3">
              Drive Today, Pay Tomorrow
            </h1>
            <p className="text-jp-muted leading-relaxed">
              We assist with vehicle financing through leading banks and NBFCs. Approval is subject to individual bank eligibility criteria.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* EMI Calculator */}
              <Reveal><EMICalculator /></Reveal>

              {/* How it works */}
              <Reveal>
                <div className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <h3 className="font-bold text-jp-text dark:text-white mb-5">How It Works</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {howItWorks.map((step) => (
                      <div key={step.step} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-jp-gold/10 text-jp-gold flex items-center justify-center text-xs font-bold flex-shrink-0">{step.step}</div>
                        <div>
                          <p className="font-semibold text-jp-text dark:text-white text-sm">{step.title}</p>
                          <p className="text-xs text-jp-muted mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Documents */}
              <Reveal>
                <div className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <h3 className="font-bold text-jp-text dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-jp-gold" /> Documents Required
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {documents.map((doc) => (
                      <div key={doc} className="flex items-center gap-2 text-sm text-jp-muted">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {doc}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-jp-muted mt-4">Document requirements may vary by lender.</p>
                </div>
              </Reveal>
            </div>

            {/* Enquiry form */}
            <Reveal delay={0.1}>
              <div className="sticky top-20">
                <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <h3 className="font-bold text-jp-text dark:text-white mb-4">Finance Enquiry</h3>
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                      <p className="font-semibold text-jp-text dark:text-white">Submitted!</p>
                      <p className="text-xs text-jp-muted mt-1">We&apos;ll contact you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Name *</label>
                        <input required value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="jp-input text-sm" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Phone *</label>
                        <input required value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} className="jp-input text-sm" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-1.5 block">Message</label>
                        <textarea rows={3} value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} className="jp-input text-sm resize-none" placeholder="Vehicle of interest, loan amount…" />
                      </div>
                      <button type="submit" className="btn btn-primary w-full text-sm">
                        Send Enquiry
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-jp-muted text-center">Finance subject to bank eligibility.</p>
                    </form>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
