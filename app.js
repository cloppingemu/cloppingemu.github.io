new Vue({
  el: "#app",
  vuetify: new Vuetify(),

  data: {
    tab: 0,
    color: "#999999",
    email_address: "Email Address",
    email_fetched: false,
    showing_voight_kampff: false,
    loading_email: false,
    email_menu: false,
    email_header: false,
    email_icon: "mdi-email",
    email_tooltip: "Email",
    copy_icon: "mdi-content-copy",
    copy_tooltip: "Copy to clipboard",
    email_clipboard_close_delay: 1000
    },

  methods: {
    copy_email_address: function(copy){
      const el = document.querySelector("#copier");
      const isOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
      el.select();
      if (copy){
        if (isOS){
          let textArea = document.createElement('textArea');
          textArea.readOnly = true;
          textArea.contentEditable = true;
          textArea.value = el.value;
          document.body.appendChild(textArea);
          let range = document.createRange();
          range.selectNodeContents(textArea);
          let selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, 999999);
          document.execCommand("copy");
          document.body.removeChild(textArea);
        } else{
          document.execCommand("copy");
        }
        this.copy_icon = "mdi-check";
        this.copy_tooltip = "Successfully copied!!"
        setTimeout(() => {
          this.copy_tooltip = "Copy to clipboard";
          this.copy_icon = "mdi-content-copy";
        }, 5000);
      }
    },
    start_email_fetch: function(){
      if (!this.email_fetched){
        this.showing_voight_kampff = true;
        this.$nextTick().then(() => {
          const txt_field = document.getElementById("voight_kampff");
          txt_field.focus()
        });
      }
    },
    get_email_address: function(){
      const txt_field = document.getElementById("voight_kampff");
      const email_field = document.getElementById("email").value;
      if (txt_field.value){
        this.showing_voight_kampff = false;
        this.loading_email = true;
        fetch(
          // "http://localhost:5000/mute-babel/us-central1/xf92-Yd24-vhm8-wBKB",
          "https://mute-babel.web.app/xf92-Yd24-vhm8-wBKB",
        {
          method: "POST",
          body: JSON.stringify({input: [txt_field.value.trim().toLowerCase(), email_field]})
        }).then((res) => {
          res.json().then((data) => {
            this.email_address = data.add;
            this.email_fetched = true;
            this.loading_email = false;
            this.email_icon = "mdi-email";
            if (this.tab == 0){
              this.email_menu = true;
            } else{
              this.email_header = true;
            }
          }).catch(() => {
            this.loading_email = false;
            this.email_icon = "mdi-window-close";
            this.email_tooltip = "Sorry!! Only humans allowed. Please try again.";
            setTimeout(() => {
              this.email_icon = "mdi-email";
              this.email_tooltip = "Email";
            }, 5000);
          });
        }).catch(() => {
          this.loading_email = false;
          this.email_icon = "mdi-window-close";
          this.email_tooltip = "Network error. Please try again.";
          setTimeout(() => {
            this.email_icon = "mdi-email";
            this.email_tooltip = "Email";
          }, 5000);
        });
      } else{
        txt_field.focus();
      }
    }
  }
});