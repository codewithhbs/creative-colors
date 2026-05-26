import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import axios from "axios";

function Settings() {
  const [settings, setSettings] = useState({
    siteName: "",
    siteUrl: "",
    contactNumber: "",
    address: "",
    supportEmail: "",
    smtp_email: "",
    smtp_password: "",
    paymentImage: "",
    logoUrl: "",
    currency: "INR",
    taxRate: 18,
    shippingCost: 50,
    freeShippingThreshold: 500,
    codFee: 20,
    copounEnables: true,
    isTaxEnables: true,
    shippingEnabled: true,
    onlinePaymentAvailable: true,
    codAvailable: true,
    maintenanceMode: false,
    paymentGateway: {
      provider: "razorpay",
      key: "",
      secret: "",
    },
    socialMediaLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("https://www.api.creativencolourful.com/api/v1/admin/settings");
      const result = await response.json();

      if (result.success && result.data) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => {
      const newValue = type === "checkbox" ? checked : value;

      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: newValue,
          },
        };
      } else {
        return {
          ...prev,
          [name]: newValue,
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `https://www.api.creativencolourful.com/api/v1/admin/settings/${settings._id}`,
        settings
      );

      console.log("Update Response:", response.data);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Settings */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
                <input type="url" name="siteUrl" value={settings.siteUrl} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input type="tel" name="contactNumber" value={settings.contactNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" name="address" value={settings.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input type="url" name="logoUrl" value={settings.logoUrl} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Image URL</label>
                <input type="url" name="paymentImage" value={settings.paymentImage} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Payment Gateway */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Payment Gateway (Razorpay)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input type="text" name="provider" value={settings.paymentGateway.provider} onChange={(e) => handleChange(e, "paymentGateway")} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
                <input type="text" name="key" value={settings.paymentGateway.key} onChange={(e) => handleChange(e, "paymentGateway")} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                <input type="password" name="secret" value={settings.paymentGateway.secret} onChange={(e) => handleChange(e, "paymentGateway")} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Email Settings (SMTP)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Email</label>
                <input type="email" name="smtp_email" value={settings.smtp_email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                <input type="password" name="smtp_password" value={settings.smtp_password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Features & Configuration */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Features & Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="copounEnables" checked={settings.copounEnables} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Enable Coupons</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="isTaxEnables" checked={settings.isTaxEnables} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Enable Tax</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="shippingEnabled" checked={settings.shippingEnabled} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Enable Shipping</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="onlinePaymentAvailable" checked={settings.onlinePaymentAvailable} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Online Payment Available</span>
                </label>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="codAvailable" checked={settings.codAvailable} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Cash on Delivery Available</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input type="text" name="currency" value={settings.currency} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
                <input type="number" name="shippingCost" value={settings.shippingCost} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold</label>
                <input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COD Fee</label>
                <input type="number" name="codFee" value={settings.codFee} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Facebook, name: "facebook", color: "text-[#1877F2]" },
                { icon: Twitter, name: "twitter", color: "text-[#1DA1F2]" },
                { icon: Instagram, name: "instagram", color: "text-[#E4405F]" },
                { icon: Linkedin, name: "linkedin", color: "text-[#0A66C2]" },
                { icon: Youtube, name: "youtube", color: "text-[#FF0000]" },
              ].map(({ icon: Icon, name, color }) => (
                <div key={name} className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${color}`} />
                  <input
                    type="url"
                    name={name}
                    value={settings.socialMediaLinks[name] || ""}
                    onChange={(e) => handleChange(e, "socialMediaLinks")}
                    placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} URL`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving Changes..." : "Save All Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;