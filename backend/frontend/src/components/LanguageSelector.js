import React, { useEffect, useState, useRef, startTransition } from "react";
import { Globe, ChevronDown } from "react-feather";
import { useTranslation } from "react-i18next";
import "../css/languageselector.css";

const languages = [
  { code: "en", key: "english" },
  { code: "ta", key: "tamil" },
];

const LanguageSelector = () => {
  const { t, i18n } = useTranslation("languageselector");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setSelectedLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    startTransition(() => {
      i18n.changeLanguage(lng, () => {
        setSelectedLanguage(lng);
        localStorage.setItem("selectedLanguage", lng);
        setDropdownVisible(false);
      });
    });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const getLanguageKey = (code) => {
    const language = languages.find((lng) => lng.code === code);
    return language ? t(language.key) : "";
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="language-selector">
        <Globe className="globe-icon-wrapper" onClick={toggleDropdown} />
        <ChevronDown className="dropdown-icon" onClick={toggleDropdown} />
        {selectedLanguage && (
          <span className="selected-language">{getLanguageKey(selectedLanguage)}</span>
        )}
        {dropdownVisible && (
          <div className="dropdown-language">
            {languages.map((lng) => (
              <div
                key={lng.code}
                className="dropdown-item"
                onClick={() => changeLanguage(lng.code)}
              >
                {t(lng.key)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
