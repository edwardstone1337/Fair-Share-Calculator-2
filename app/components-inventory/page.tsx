'use client';

import { useState } from 'react';

// Atoms
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';
import { SectionHeader } from '@/components/ui/section-header';
import { Snackbar } from '@/components/ui/snackbar';
import { CurrencySelector } from '@/components/ui/currency-selector';

// Organisms
import { SummaryCard } from '@/components/calculator/summary-card';
import { BreakdownCard } from '@/components/calculator/breakdown-card';
import { ExplanationCard } from '@/components/calculator/explanation-card';
import { ResultsFooter } from '@/components/calculator/results-footer';

import { formatCurrency } from '@/lib/calculator/compute';

export default function ComponentsInventory() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [currencyValue, setCurrencyValue] = useState('USD');

  const noop = () => {};

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-10)',
      fontFamily: 'var(--font-family-body)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-family-heading)',
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--text-primary)',
      }}>
        Component Inventory
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)' }}>
        All components organized by atomic design level. For QA and design review only.
      </p>

      {/* ========== ATOMS ========== */}
      <section>
        <h2 style={{
          fontFamily: 'var(--font-family-heading)',
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-6)',
          paddingBottom: 'var(--space-2)',
          borderBottom: '2px solid var(--border-default)',
        }}>
          Atoms
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

          {/* Button */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              Button
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" onClick={noop}>Primary Button</Button>
              <Button variant="secondary" onClick={noop}>Secondary Button</Button>
              <Button variant="primary" fullWidth onClick={noop}>Full Width Primary</Button>
            </div>
          </div>

          {/* Input */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              Input
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '300px' }}>
              <Input id="inv-input-1" placeholder="Default input" />
              <Input id="inv-input-2" placeholder="With prefix" prefix="$" />
              <Input id="inv-input-3" placeholder="With prefix (GBP)" prefix="£" />
              <Input id="inv-input-4" placeholder="0" prefix="A$" type="password" />
              <Input id="inv-input-5" placeholder="Error state" error />
              <Input id="inv-input-6" placeholder="Error with prefix" prefix="$" error />
            </div>
          </div>

          {/* Label */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              Label
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Label htmlFor="inv-label-1">Optional label</Label>
              <Label htmlFor="inv-label-2" required>Required label</Label>
            </div>
          </div>

          {/* Card */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              Card
            </h3>
            <Card>
              <p style={{ color: 'var(--text-primary)' }}>Card with default padding, border, and radius.</p>
            </Card>
          </div>

          {/* SectionHeader */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              SectionHeader
            </h3>
            <SectionHeader
              title="Section Title"
              description="Optional description text that explains this section."
            />
          </div>

          {/* ErrorMessage */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              ErrorMessage
            </h3>
            <ErrorMessage id="inv-error-1" message="This is an error message" />
          </div>

          {/* CurrencySelector */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              CurrencySelector
            </h3>
            <CurrencySelector value={currencyValue} onChange={setCurrencyValue} />
          </div>

          {/* Snackbar */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              Snackbar
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="secondary" onClick={() => setSnackbarVisible(true)}>
                Show Snackbar
              </Button>
            </div>
            <Snackbar
              message="Calculation link copied to clipboard!"
              visible={snackbarVisible}
              onHide={() => setSnackbarVisible(false)}
            />
          </div>

        </div>
      </section>

      {/* ========== MOLECULES ========== */}
      <section>
        <h2 style={{
          fontFamily: 'var(--font-family-heading)',
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-6)',
          paddingBottom: 'var(--space-2)',
          borderBottom: '2px solid var(--border-default)',
        }}>
          Molecules
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

          {/* ResultsFooter */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              ResultsFooter
            </h3>
            <div style={{ maxWidth: '410px' }}>
              <ResultsFooter onBackToEdit={noop} onShare={noop} />
            </div>
          </div>

        </div>
      </section>

      {/* ========== ORGANISMS ========== */}
      <section>
        <h2 style={{
          fontFamily: 'var(--font-family-heading)',
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-6)',
          paddingBottom: 'var(--space-2)',
          borderBottom: '2px solid var(--border-default)',
        }}>
          Organisms
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

          {/* SummaryCard */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              SummaryCard
            </h3>
            <div style={{ maxWidth: '410px' }}>
              <SummaryCard
                person1Name="Alice"
                person2Name="Bob"
                person1TotalShare={1200}
                person2TotalShare={800}
                person1Percentage={60}
                person2Percentage={40}
                totalExpenses={2000}
                expenseCount={1}
                formatCurrency={(n: number) => formatCurrency(n, '$')}
              />
            </div>
          </div>

          {/* BreakdownCard */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              BreakdownCard
            </h3>
            <div style={{ maxWidth: '410px' }}>
              <BreakdownCard
                person1Name="Alice"
                person2Name="Bob"
                expenseBreakdown={[
                  { label: 'Rent', amount: 2000, person1Share: 1200, person2Share: 800 },
                  { label: 'Utilities', amount: 200, person1Share: 120, person2Share: 80 },
                ]}
                formatCurrency={(n: number) => formatCurrency(n, '$')}
              />
            </div>
          </div>

          {/* ExplanationCard */}
          <div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              ExplanationCard
            </h3>
            <div style={{ maxWidth: '410px' }}>
              <ExplanationCard
                person1Name="Alice"
                person2Name="Bob"
                person1Percentage={60}
                person2Percentage={40}
                person1Salary={60000}
                person2Salary={40000}
                combinedSalary={100000}
                currencySymbol="$"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ========== NOTE ========== */}
      <section style={{
        padding: 'var(--space-4)',
        background: 'var(--surface-subtle)',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--text-secondary)',
        fontSize: 'var(--font-size-sm)',
      }}>
        <p><strong>Note:</strong> IncomeSection, ExpensesSection, NamesSection, and NavBar are not rendered here because they require full state management (useCalculator hook / CurrencyContext). They are tested via the main calculator page. ExpenseRow similarly requires parent state and callbacks to render properly.</p>
        <p style={{ marginTop: 'var(--space-2)' }}><strong>Back to Top</strong> and <strong>FaqSection</strong> are server/page-level components and are excluded from this inventory.</p>
      </section>
    </div>
  );
}
