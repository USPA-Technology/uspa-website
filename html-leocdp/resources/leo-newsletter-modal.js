(function (window) {
  "use strict";

  class LeoNewsletterModal {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          locale: "en",
          mountTo: document.body,
          i18n: {},
          triggerSelector: "[data-leo-newsletter]",
        },
        options,
      );

      this._createModal();
      this._bindTriggers();
    }

    // ======================
    // Public API
    // ======================

    open(source = null) {
      this.overlay.classList.add("active");
      this._dispatch("leo.newsletter.open", { source });
    }

    close() {
      this.overlay.classList.remove("active");
      this._dispatch("leo.newsletter.close", {});
    }

    setLocale(locale) {
      this.options.locale = locale;
      this._applyI18n();
    }

    // ======================
    // Private
    // ======================

    _createModal() {
      this.overlay = document.createElement("div");
      this.overlay.className = "leo-modal-overlay";

      this.overlay.innerHTML = `
        <div class="leo-modal">
          <button class="leo-modal-close">&times;</button>
          <div class="leo-modal-title"></div>
          <div class="leo-modal-description"></div>
          <form>
            <input type="text" id="leo-name-input" class="leo-input" required />
            <input type="email" id="leo-email-input" class="leo-input" required />
            <button type="submit" class="leo-button"></button>
          </form>
          <div class="leo-success"></div>
          <div class="leo-footer-text"></div>
        </div>
      `;

      this.options.mountTo.appendChild(this.overlay);

      this.modal = this.overlay.querySelector(".leo-modal");
      this.closeBtn = this.overlay.querySelector(".leo-modal-close");
      this.form = this.overlay.querySelector("form");
      this.inputName = this.overlay.querySelector("#leo-name-input");
      this.inputEmail = this.overlay.querySelector("#leo-email-input");
      this.button = this.overlay.querySelector(".leo-button");
      this.successBox = this.overlay.querySelector(".leo-success");
      this.titleEl = this.overlay.querySelector(".leo-modal-title");
      this.descEl = this.overlay.querySelector(".leo-modal-description");
      this.footerText = this.overlay.querySelector(".leo-footer-text");

      this._applyI18n();
      this._bindEvents();
    }

    _applyI18n() {
      const dict = this.options.i18n[this.options.locale] || {};

      this.titleEl.textContent = dict.title || "LEO CDP Updates";
      this.descEl.textContent =
        dict.description ||
        "Get product updates and technical releases directly to your inbox.";
      this.inputName.placeholder = dict.placeholderName || "Your name";
      this.inputEmail.placeholder = dict.placeholderEmail || "Your work email";
      this.button.textContent = dict.button || "Subscribe";
      this.footerText.textContent =
        dict.footer || "No spam. Unsubscribe anytime.";
      this.successBox.textContent =
        dict.success || "Thank you! You have successfully subscribed.";
    }

    _bindEvents() {
      this.closeBtn.addEventListener("click", () => this.close());

      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });

      this.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = this.inputName.value.trim();
        const email = this.inputEmail.value.trim();

        // Validate name (min 3 chars)
        if (!name || name.length < 3) {
          this._dispatch("leo.newsletter.error", {
            field: "name",
            message: "Name must be at least 3 characters",
            name,
            email,
          });
          return;
        }

        // Validate email
        if (!this._validateEmail(email)) {
          this._dispatch("leo.newsletter.error", {
            field: "email",
            message: "Invalid email format",
            name,
            email,
          });
          return;
        }

        this._dispatch("leo.newsletter.submit", { name, email });

        // Show success
        this.successBox.style.display = "block";

        this._dispatch("leo.newsletter.success", { name, email });

        // Auto close after 3 seconds
        setTimeout(() => {
          this.form.reset();
          this.successBox.style.display = "none";
          this.close();
        }, 3000);
      });
    }

    _bindTriggers() {
      document.querySelectorAll(this.options.triggerSelector).forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          const source = el.getAttribute("data-leo-newsletter");
          this.open(source);
        });
      });
    }

    _validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    _dispatch(name, detail) {
      document.dispatchEvent(new CustomEvent(name, { detail }));
    }
  }

  window.LeoNewsletterModal = LeoNewsletterModal;
})(window);
