import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../hooks/useToast";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { IoMoon, IoSunny } from "react-icons/io5";

const Settings = () => {
  const { settings, dispatch, ACTIONS } = useApp();
  const { addToast } = useToast();
  const [companySettings, setCompanySettings] = useState(settings);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const handleSave = () => {
    dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: companySettings });
    addToast("Settings saved successfully", "success");
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Company Settings</CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Company Name"
              value={companySettings.companyName}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  companyName: e.target.value,
                })
              }
            />
            <Input
              label="Address"
              value={companySettings.address}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  address: e.target.value,
                })
              }
            />
            <Input
              label="Email"
              type="email"
              value={companySettings.email}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  email: e.target.value,
                })
              }
            />
            <Input
              label="Phone"
              value={companySettings.phone}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  phone: e.target.value,
                })
              }
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Inventory Settings</CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Default Reorder Level"
              type="number"
              value={companySettings.defaultReorderLevel}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  defaultReorderLevel: e.target.value,
                })
              }
            />
            <Input
              label="Currency"
              value={companySettings.currency}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  currency: e.target.value,
                })
              }
            />
            <Input
              label="Measurement Units"
              value={companySettings.measurementUnits}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  measurementUnits: e.target.value,
                })
              }
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>User Preferences</CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                {isDark ? <IoSunny /> : <IoMoon />}
              </button>
            </div>
            <Select
              label="Language"
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
              ]}
              value={companySettings.language}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  language: e.target.value,
                })
              }
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={companySettings.notificationsEnabled}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    notificationsEnabled: e.target.checked,
                  })
                }
              />
              <label>Enable Notifications</label>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save All Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
