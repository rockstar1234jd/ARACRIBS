// Aracribs - Care Guides & Invertebrate Husbandry Modal
export class GuidesModal {
  constructor() {
    this.modalEl = document.getElementById('guidesModalContainer');
    if (!this.modalEl) {
      this.createModalDOM();
    } else {
      this.modalEl.className = 'modal-backdrop hidden';
    }
    this.bindEvents();
  }

  createModalDOM() {
    const el = document.createElement('div');
    el.id = 'guidesModalContainer';
    el.className = 'modal-backdrop hidden';
    document.body.appendChild(el);
    this.modalEl = el;
  }

  open(guide) {
    this.render(guide);
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  formatContent(markdownText) {
    // Simple fast markdown formatter for bold, headers, and bullet lists
    let html = markdownText
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>');

    // Wrap list items in ul
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    return html;
  }

  render(guide) {
    this.modalEl.innerHTML = `
      <div class="modal-dialog guide-dialog">
        <button class="modal-close-btn" id="guideCloseBtn" aria-label="Close guide">&times;</button>

        <div class="guide-modal-header">
          <div class="guide-meta-strip">
            <span class="guide-cat-badge">${guide.category}</span>
            <span class="guide-read-time">⏱️ ${guide.readTime}</span>
          </div>
          <h1 class="guide-modal-title">${guide.title}</h1>
          <p class="guide-modal-summary">${guide.summary}</p>
        </div>

        <div class="guide-modal-body">
          ${this.formatContent(guide.content)}
        </div>

        <div class="guide-modal-footer">
          <div class="guide-help-box">
            <h4>Have specific species questions?</h4>
            <p>Our husbandry support team of experienced keepers is always on standby to help you setup your crib.</p>
          </div>
          <button class="btn btn-primary" id="guideDoneBtn">Back to Habitats</button>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('guideCloseBtn');
    const doneBtn = document.getElementById('guideDoneBtn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (doneBtn) doneBtn.addEventListener('click', () => this.close());
  }

  bindEvents() {
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.close();
      }
    });
  }
}
