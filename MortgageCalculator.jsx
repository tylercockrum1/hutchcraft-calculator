
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

function CurrencyInput({ label, value, setter }) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <Input
          type="text"
          inputMode="numeric"
          aria-label={label}
          placeholder="$0"
          value={value.toLocaleString()}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^\d]/g, "");
            setter(Number(clean));
          }}
          className="pl-7 rounded-xl text-base"
        />
      </div>
    </div>
  );
}

export default function MortgageCalculator() {
  const borrowerName = "The Hutchcraft Family";

  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(50000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [hoa, setHoa] = useState(0);
  const [loanType, setLoanType] = useState("FHA"); // "FHA" or "Conventional"

  const interestRate = loanType === "FHA" ? 6.5 : 7.25;
  const propertyTaxRate = 0.75;
  const insurance = 150;

  const loanAmount = purchasePrice - downPayment;
  const ltv = loanAmount / purchasePrice;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const monthlyPrincipalAndInterest =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

  const monthlyPropertyTax = (purchasePrice * (propertyTaxRate / 100)) / 12;

  // MIP (only if FHA)
  let fhaMortgageInsurance = 0;
  let mipRate = 0;
  if (loanType === "FHA") {
    if (loanTerm <= 15) {
      mipRate = ltv > 0.9 ? 0.007 : ltv > 0.78 ? 0.0035 : 0.0015;
    } else {
      mipRate = ltv > 0.9 ? 0.0055 : 0.005;
    }
    fhaMortgageInsurance = (loanAmount * mipRate) / 12;
  }

  const totalMonthlyPayment =
    monthlyPrincipalAndInterest +
    monthlyPropertyTax +
    insurance +
    fhaMortgageInsurance +
    Number(hoa);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 font-sans text-gray-800">
      <div className="max-w-md mx-auto">
        <Card className="rounded-3xl shadow-lg border border-gray-200">
          <CardContent className="space-y-6 p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{borrowerName}</h2>
              <p className="text-sm text-gray-600 font-medium">Monthly Mortgage Calculator</p>
            </div>

            <div className="grid gap-4">
              <CurrencyInput label="Purchase Price" value={purchasePrice} setter={setPurchasePrice} />
              <CurrencyInput label="Down Payment" value={downPayment} setter={setDownPayment} />
              <div>
                <Label className="text-sm font-medium text-gray-700">Loan Term (years)</Label>
                <Input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="rounded-xl text-base"
                />
              </div>
              <CurrencyInput label="HOA Fees (monthly)" value={hoa} setter={setHoa} />
              <div>
                <Label className="text-sm font-medium text-gray-700">Loan Type</Label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full mt-1 rounded-xl border-gray-300 text-base p-2"
                >
                  <option value="FHA">FHA (6.5%)</option>
                  <option value="Conventional">Conventional (7.25%)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 p-5 bg-white border border-blue-100 rounded-2xl shadow-sm text-center">
              <p className="font-semibold text-gray-700">Estimated Monthly Payment</p>
              <p className="text-4xl font-bold text-blue-700 mt-2">
                ${Number(totalMonthlyPayment.toFixed(2)).toLocaleString()}
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Includes taxes, insurance{loanType === "FHA" ? `, and FHA mortgage insurance (rate: ${(mipRate * 100).toFixed(2)}%)` : ""}
              </p>
            </div>

            <Button
              className="w-full mt-6 text-lg font-semibold rounded-xl shadow"
              variant="default"
              onClick={() => window.location.href = 'tel:5023795303'}
            >
              <Phone className="mr-2 h-5 w-5" /> Call Tyler
            </Button>

            <div className="pt-6 text-center text-sm text-gray-500 border-t border-gray-200">
              <p className="font-medium text-gray-700">Tyler Cockrum</p>
              <p>NMLS #1529908 • Sierra Pacific Mortgage</p>
              <p>📞 (502) 379-5303</p>
              <p>✉️ tyler.cockrum@spmc.com</p>
              <p className="mt-2 text-xs">Powered by My Mortgage Guy Ty</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
