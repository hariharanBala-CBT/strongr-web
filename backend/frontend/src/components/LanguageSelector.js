import React, { useEffect, useState, useRef } from "react";
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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng, () => {
      setSelectedLanguage(lng);
      setDropdownVisible(false);
    });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
    <div className="language-selector">
      <Globe className="globe-icon-wrapper" onClick={toggleDropdown} />
      <ChevronDown className="dropdown-icon" onClick={toggleDropdown} />
      {selectedLanguage && (
        <span className="selected-language">{t(selectedLanguage)}</span>
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
