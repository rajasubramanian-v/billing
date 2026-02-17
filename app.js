const lineItems = document.getElementById('lineItems');
const template = document.getElementById('lineItemTemplate');

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

function createLineItem(data = {}) {
  const row = template.content.firstElementChild.cloneNode(true);
  const description = row.querySelector('.item-description');
  const qty = row.querySelector('.item-qty');
  const unit = row.querySelector('.item-unit');
  const price = row.querySelector('.item-price');
  const amount = row.querySelector('.item-amount');
  const removeBtn = row.querySelector('.danger');

  description.value = data.description ?? '';
  qty.value = data.qty ?? '';
  unit.value = data.unit ?? '';
  price.value = data.price ?? '';

  const recalcRow = () => {
    const lineTotal = Number(qty.value || 0) * Number(price.value || 0);
    amount.textContent = currency.format(lineTotal);
    calculateTotals();
  };

  [description, qty, unit, price].forEach((input) => {
    input.addEventListener('input', recalcRow);
  });

  removeBtn.addEventListener('click', () => {
    row.remove();
    calculateTotals();
  });

  lineItems.appendChild(row);
  recalcRow();
}

function calculateTotals() {
  const rows = [...lineItems.querySelectorAll('tr')];
  const subtotal = rows.reduce((sum, row) => {
    const qty = Number(row.querySelector('.item-qty')?.value || 0);
    const price = Number(row.querySelector('.item-price')?.value || 0);
    return sum + qty * price;
  }, 0);

  const discountRate = Number(document.getElementById('discount').value || 0) / 100;
  const taxRate = Number(document.getElementById('tax').value || 0) / 100;

  const discountAmount = subtotal * discountRate;
  const taxable = subtotal - discountAmount;
  const taxAmount = taxable * taxRate;
  const grandTotal = taxable + taxAmount;

  document.getElementById('subtotal').textContent = currency.format(subtotal);
  document.getElementById('discountAmount').textContent = currency.format(discountAmount);
  document.getElementById('taxAmount').textContent = currency.format(taxAmount);
  document.getElementById('grandTotal').textContent = currency.format(grandTotal);
}

function getFormState() {
  return {
    meta: {
      quoteNumber: document.getElementById('quoteNumber').value,
      quoteDate: document.getElementById('quoteDate').value,
      companyName: document.getElementById('companyName').value,
      companyContact: document.getElementById('companyContact').value,
      clientName: document.getElementById('clientName').value,
      clientContact: document.getElementById('clientContact').value,
      discount: document.getElementById('discount').value,
      tax: document.getElementById('tax').value,
      scope: document.getElementById('scope').value,
      terms: document.getElementById('terms').value,
    },
    items: [...lineItems.querySelectorAll('tr')].map((row) => ({
      description: row.querySelector('.item-description')?.value || '',
      qty: Number(row.querySelector('.item-qty')?.value || 0),
      unit: row.querySelector('.item-unit')?.value || '',
      price: Number(row.querySelector('.item-price')?.value || 0),
    })),
  };
}

function applyFormState(state) {
  if (!state) return;

  const { meta = {}, items = [] } = state;
  Object.entries(meta).forEach(([key, value]) => {
    const node = document.getElementById(key);
    if (node) node.value = value;
  });

  lineItems.innerHTML = '';
  if (!items.length) createLineItem();
  items.forEach((item) => createLineItem(item));
  calculateTotals();
}

const storageKey = 'electricalQuotationDraft';

document.getElementById('addItemBtn').addEventListener('click', () => createLineItem());
document.getElementById('saveDraftBtn').addEventListener('click', () => {
  localStorage.setItem(storageKey, JSON.stringify(getFormState()));
  alert('Draft saved locally.');
});
document.getElementById('loadDraftBtn').addEventListener('click', () => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    alert('No saved draft found.');
    return;
  }

  applyFormState(JSON.parse(raw));
});
document.getElementById('printBtn').addEventListener('click', () => window.print());

['discount', 'tax'].forEach((id) => {
  document.getElementById(id).addEventListener('input', calculateTotals);
});

createLineItem();
