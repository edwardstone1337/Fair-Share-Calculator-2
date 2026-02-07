'use client';

import { useState } from 'react';

// Atoms
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';
import { SectionHeader } from '@/components/ui/section-header';
import { Snackbar } from '@/components/ui/snackbar';
import { CurrencySelector } from '@/components/ui/currency-selector';

// Molecules
import { FormField } from '@/components/ui/form-field';

// Organisms
import { NavBar } from '@/components/nav/nav-bar';
import { SummaryCard } from '@/components/calculator/summary-card';
import { BreakdownCard } from '@/components/calculator/breakdown-card';
import { ExplanationCard } from '@/components/calculator/explanation-card';
import { ResultsFooter } from '@/components/calculator/results-footer';
import { ExpenseRow } from '@/components/calculator/expense-row';

import { formatCurrency } from '@/lib/calculator/compute';

const h3Style: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  marginBottom: 'var(--space-3)',
  color: 'var(--text-primary)',
};

export default function ComponentsInventory() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [currencyValue, setCurrencyValue] = useState('USD');

  const noop = () => {};

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--surface-page)',
      padding: 'var(--space-8) var(--space-4)',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'var(--app-bg)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-8) var(--space-6)',
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
      <p style={{
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--surface-subtle)',
        borderRadius: 'var(--radius-md)',
      }}>
        <strong>Touch target:</strong> All interactive components render at exactly 48px height (<code style={{ fontFamily: 'monospace' }}>height: var(--touch-target-min-height)</code>, <code style={{ fontFamily: 'monospace' }}>box-sizing: border-box</code>).
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
            <h3 style={h3Style}>
              Button
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
              Height 48px (--touch-target-min-height).
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" onClick={noop}>Primary Button</Button>
              <Button variant="secondary" onClick={noop}>Secondary Button</Button>
              <Button variant="primary" fullWidth onClick={noop}>Full Width Primary</Button>
            </div>
          </div>

          {/* Icon */}
          <div>
            <h3 style={h3Style}>Icon</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <Icon name="remove" size="var(--icon-size-sm)" />
              <Icon name="visibility" size="var(--icon-size-md)" />
              <Icon name="visibility_off" size="var(--icon-size-md)" />
              <Icon name="add" size="var(--icon-size-md)" />
              <Icon name="lightbulb" size="var(--icon-size-md)" />
              <Icon name="receipt_long" size="var(--icon-size-md)" />
            </div>
          </div>

          {/* IconButton */}
          <div>
            <h3 style={h3Style}>IconButton</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
              48px touch target (--icon-button-size). Variants: ghost and danger.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
                <IconButton icon="remove" variant="danger" onClick={noop} aria-label="Delete" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>danger (48px)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
                <IconButton icon="visibility" variant="ghost" onClick={noop} aria-label="Toggle" />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>ghost (48px)</span>
              </div>
            </div>
          </div>

          {/* Input */}
          <div>
            <h3 style={h3Style}>
              Input
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
              Height 48px (bare and prefixed).
            </p>
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
            <h3 style={h3Style}>
              Label
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Label htmlFor="inv-label-1">Optional label</Label>
              <Label htmlFor="inv-label-2" required>Required label</Label>
            </div>
          </div>

          {/* Card */}
          <div>
            <h3 style={h3Style}>
              Card
            </h3>
            <Card>
              <p style={{ color: 'var(--text-primary)' }}>Card with default padding, border, and radius.</p>
            </Card>
          </div>

          {/* SectionHeader */}
          <div>
            <h3 style={h3Style}>
              SectionHeader
            </h3>
            <SectionHeader
              title="Section Title"
              description="Optional description text that explains this section."
            />
          </div>

          {/* ErrorMessage */}
          <div>
            <h3 style={h3Style}>
              ErrorMessage
            </h3>
            <ErrorMessage id="inv-error-1" message="This is an error message" />
          </div>

          {/* CurrencySelector */}
          <div>
            <h3 style={h3Style}>
              CurrencySelector
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
              Height 48px.
            </p>
            <CurrencySelector value={currencyValue} onChange={setCurrencyValue} />
          </div>

          {/* Snackbar */}
          <div>
            <h3 style={h3Style}>
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

          {/* FormField */}
          <div>
            <h3 style={h3Style}>FormField</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '300px' }}>
              <FormField
                id="inv-formfield-1"
                label="Your salary"
                required
                placeholder="0"
                prefix="$"
              />
              <FormField
                id="inv-formfield-2"
                label="Your salary"
                required
                placeholder="0"
                prefix="$"
                error="Please enter a valid salary amount"
              />
              <FormField
                id="inv-formfield-3"
                label="Your name"
                placeholder="e.g. Alex (optional)"
              />
              <FormField
                id="inv-formfield-4"
                label="Your salary"
                required
                placeholder="0"
                prefix="£"
                labelSuffix={
                  <IconButton
                    icon="visibility"
                    variant="ghost"
                    onClick={noop}
                    aria-label="Toggle visibility"
                  />
                }
              />
            </div>
          </div>

          {/* ExpenseRow */}
          <div>
            <h3 style={h3Style}>ExpenseRow</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '410px' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                First row (no delete button):
              </p>
              <ExpenseRow
                expense={{ id: 'inv-expense-1', amount: '', label: '' }}
                index={0}
                onAmountChange={noop}
                onLabelChange={noop}
                onDelete={noop}
                onKeyDown={noop}
              />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Subsequent row (with delete button):
              </p>
              <ExpenseRow
                expense={{ id: 'inv-expense-2', amount: '2,000', label: 'Rent' }}
                index={1}
                onAmountChange={noop}
                onLabelChange={noop}
                onDelete={noop}
                onKeyDown={noop}
              />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Error state:
              </p>
              <ExpenseRow
                expense={{ id: 'inv-expense-3', amount: '', label: 'Groceries' }}
                index={1}
                error="Please enter an expense amount"
                onAmountChange={noop}
                onLabelChange={noop}
                onDelete={noop}
                onKeyDown={noop}
              />
            </div>
          </div>

          {/* ResultsFooter */}
          <div>
            <h3 style={h3Style}>
              ResultsFooter
            </h3>
            <div style={{ maxWidth: '410px' }}>
              <ResultsFooter
                onBackToEdit={noop}
                onSave={noop}
                saveState="idle"
              />
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
            <h3 style={h3Style}>
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
            <h3 style={h3Style}>
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
            <h3 style={h3Style}>
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

          {/* NavBar */}
          <div>
            <h3 style={h3Style}>NavBar</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
              Sticky nav with logo (left) and currency selector (right). Also visible at the top of this page.
            </p>
            <div style={{
              border: '1px dashed var(--border-default)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--nav-bg)',
            }}>
              <NavBar />
            </div>
          </div>

          {/* ResultsView */}
          <div>
            <h3 style={h3Style}>ResultsView (composite)</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
              Composes SummaryCard + BreakdownCard + ExplanationCard + ResultsFooter. Each card is shown individually above.
            </p>
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
        <p><strong>Included:</strong> All atoms, molecules (FormField, ExpenseRow, ResultsFooter), and organisms (SummaryCard, BreakdownCard, ExplanationCard) with realistic test data.</p>
        <p style={{ marginTop: 'var(--space-2)' }}><strong>Rendered elsewhere:</strong> NavBar (visible at top of this page). IncomeSection, ExpensesSection require useCalculator state — tested via the main calculator page.</p>
        <p style={{ marginTop: 'var(--space-2)' }}><strong>Page-level:</strong> FAQ page (`app/faq/page.tsx`), BackToTopButton, CalculatorClient, and ResultsView are page-level compositions; calculator page is SSR shell + CalculatorClient + JSON-LD only.</p>
      </section>
      </div>
    </main>
  );
}
