import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../css/languageselector.css";

const languages = [
  { code: "en", lang: "English" },
  { code: "ta", lang: "Tamil" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng, () => {
      setSelectedLanguage(lng);
    });
  };

  return (
    <div className="dropdown-container">
      <select
        value={selectedLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {languages.map((lng) => (
          <option key={lng.code} value={lng.code}>
            {lng.lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
