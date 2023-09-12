import { I18n } from "i18n-js";

import fr from "../translations/fr.json"

const i18n = new I18n({
  fr: fr,
});
i18n.enableFallback = true;

i18n.locale = "fr";
export default i18n;
