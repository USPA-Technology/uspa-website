(function (window) {
  "use strict";

  class LeoNewsletterModal {
    constructor(options = {}) {
      // Default settings
      this.options = Object.assign(
        {
          locale: "en",
          mountTo: document.body,
          i18n: {},
          triggerSelector: "[data-leo-newsletter]",
          collectPhone: false, // New Config: set to true to ask for phone
          autoCloseDelay: 3000,
        },
        options
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
      // Focus first input for UX
      setTimeout(() => this.inputName.focus(), 100);
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

      // Conditionally add Phone Input based on config
      const phoneInputHTML = this.options.collectPhone
        ? `<input type="tel" id="leo-phone-input" class="leo-input" />`
        : "";

      this.overlay.innerHTML = `
        <div class="leo-modal">
          <button class="leo-modal-close" aria-label="Close">&times;</button>
          <div class="leo-modal-title"></div>
          <div class="leo-modal-description"></div>
          <form>
            <input type="text" id="leo-name-input" class="leo-input" required />
            <input type="email" id="leo-email-input" class="leo-input" required />
            ${phoneInputHTML}
            <button type="submit" class="leo-button"></button>
          </form>
          <div class="leo-success"></div>
          <div class="leo-footer-text"></div>
        </div>
      `;

      this.options.mountTo.appendChild(this.overlay);

      // Select Elements
      this.modal = this.overlay.querySelector(".leo-modal");
      this.closeBtn = this.overlay.querySelector(".leo-modal-close");
      this.form = this.overlay.querySelector("form");
      this.inputName = this.overlay.querySelector("#leo-name-input");
      this.inputEmail = this.overlay.querySelector("#leo-email-input");
      // Select phone input only if it exists
      this.inputPhone = this.overlay.querySelector("#leo-phone-input"); 
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
      this.descEl.textContent = dict.description || "Get product updates directly to your inbox.";
      
      this.inputName.placeholder = dict.placeholderName || "Your name";
      this.inputEmail.placeholder = dict.placeholderEmail || "Your work email";
      
      // Phone placeholder
      if(this.inputPhone) {
        this.inputPhone.placeholder = dict.placeholderPhone || "Your phone number";
      }

      this.button.textContent = dict.button || "Subscribe";
      this.footerText.textContent = dict.footer || "No spam. Unsubscribe anytime.";
      this.successBox.textContent = dict.success || "Thank you! You have successfully subscribed.";
    }

    _bindEvents() {
      const closeHandler = () => this.close();
      this.closeBtn.addEventListener("click", closeHandler);
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) closeHandler();
      });

      this.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = this.inputName.value.trim();
        const email = this.inputEmail.value.trim();
        let phone = "";

        // 1. Validate Name
        if (!name || name.length < 2) {
          this._handleError("name", "Name is too short");
          return;
        }

        // 2. Validate Email
        if (!this._validateEmail(email)) {
          this._handleError("email", "Invalid email format");
          return;
        }

        // 3. Validate Phone (If enabled)
        if (this.options.collectPhone && this.inputPhone) {
           phone = this.inputPhone.value.trim();
           if (!this._validatePhone(phone)) {
             this._handleError("phone", "Invalid phone number");
             return;
           }
        }

        // Prepare Data payload
        const payload = { name, email };
        if (this.options.collectPhone) payload.phone = phone;

        // Dispatch Submit
        this._dispatch("leo.newsletter.submit", payload);

        // UI Success state
        this.successBox.style.display = "block";
        this.form.style.display = "none"; // Hide form to prevent double submit
        
        // Dispatch Success
        this._dispatch("leo.newsletter.success", payload);

        // Auto close and reset
        setTimeout(() => {
          this.form.reset();
          this.successBox.style.display = "none";
          this.form.style.display = "block"; // Restore form for next time
          this.close();
        }, this.options.autoCloseDelay);
      });
    }

    _bindTriggers() {
      const triggers = document.querySelectorAll(this.options.triggerSelector);
      if(triggers.length > 0) {
        triggers.forEach((el) => {
          el.addEventListener("click", (e) => {
            e.preventDefault();
            const source = el.getAttribute("data-leo-newsletter");
            this.open(source);
          });
        });
      }
    }

    _handleError(field, message) {
      alert(message); // Simple alert, or you can implement inline error rendering
      this._dispatch("leo.newsletter.error", { field, message });
      
      // Focus the error field
      if(field === 'name') this.inputName.focus();
      if(field === 'email') this.inputEmail.focus();
      if(field === 'phone' && this.inputPhone) this.inputPhone.focus();
    }

    _validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    _validatePhone(phone) {
      // 1. Strip all non-numeric characters (spaces, dashes, parens, plus)
      const digitsOnly = phone.replace(/\D/g, '');
      
      // 2. Check if we have digits remaining (usually 7 to 15 digits for international)
      // This satisfies the requirement: "validate as number, not string" logic
      const isNumeric = /^\d+$/.test(digitsOnly);
      
      return isNumeric && digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }

    _dispatch(name, detail) {
      document.dispatchEvent(new CustomEvent(name, { detail }));
    }
  }

  window.LeoNewsletterModal = LeoNewsletterModal;
})(window);