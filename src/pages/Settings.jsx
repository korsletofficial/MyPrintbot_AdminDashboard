import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Info } from 'lucide-react';
import { adminSettingsAPI } from '../api/endpoints/adminSettings';
import { toast } from 'sonner';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Payment Settings
    razorpayKeyId: '',
    razorpayKeySecret: '',
    defaultPricePerCard: 5,
    minJobAmount: 500,
    maxJobAmount: 100000,
    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmailAddress: '',
    // General Settings
    platformName: 'MyPrintBot',
    supportEmail: '',
    maintenanceMode: false,
    allowNewRegistrations: true,
    // Contact Information
    contactPhone: '',
    contactEmail: '',
    // Referral Program Configuration
    referralSignupBonus: 500,
    referralWelcomeBonus: 200,
    referralCreditExpiryMonths: 12,
    referralMaxUsagePercent: 50,
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminSettingsAPI.getAdminSettings();
      if (response.success) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePayment = async () => {
    try {
      setSaving(true);
      const response = await adminSettingsAPI.updateAdminSettings({
        razorpayKeyId: settings.razorpayKeyId,
        razorpayKeySecret: settings.razorpayKeySecret,
        defaultPricePerCard: parseFloat(settings.defaultPricePerCard),
        minJobAmount: parseFloat(settings.minJobAmount),
        maxJobAmount: parseFloat(settings.maxJobAmount),
      });
      
      if (response.success) {
        toast.success('Payment settings saved successfully!');
        fetchSettings(); // Refresh to get updated data
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error(error.response?.data?.error || 'Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    try {
      setSaving(true);
      const response = await adminSettingsAPI.updateAdminSettings({
        smtpHost: settings.smtpHost,
        smtpPort: parseInt(settings.smtpPort),
        smtpUser: settings.smtpUser,
        smtpPassword: settings.smtpPassword,
        fromEmailAddress: settings.fromEmailAddress,
      });

      if (response.success) {
        toast.success('Email settings saved successfully!');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error(error.response?.data?.error || 'Failed to save email settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async () => {
    try {
      setSaving(true);
      const response = await adminSettingsAPI.updateAdminSettings({
        supportEmail: settings.supportEmail,
        contactPhone: settings.contactPhone,
        contactEmail: settings.contactEmail,
      });

      if (response.success) {
        toast.success('Contact information saved successfully!');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error saving contact information:', error);
      toast.error(error.response?.data?.error || 'Failed to save contact information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReferral = async () => {
    try {
      setSaving(true);
      const response = await adminSettingsAPI.updateAdminSettings({
        referralSignupBonus: parseFloat(settings.referralSignupBonus),
        referralWelcomeBonus: parseFloat(settings.referralWelcomeBonus),
        referralCreditExpiryMonths: parseInt(settings.referralCreditExpiryMonths),
        referralMaxUsagePercent: parseInt(settings.referralMaxUsagePercent),
      });

      if (response.success) {
        toast.success('Referral program settings saved successfully!');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error saving referral settings:', error);
      toast.error(error.response?.data?.error || 'Failed to save referral settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage platform configuration and preferences
        </p>
      </div>

      {/* Payment Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Configure Razorpay and pricing</p>
          </div>
          <Button onClick={handleSavePayment} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
              <Input
                id="razorpayKeyId"
                type="text"
                value={settings.razorpayKeyId || ''}
                onChange={(e) => handleChange('razorpayKeyId', e.target.value)}
                placeholder="rzp_test_xxxxxxxxxxxxx"
              />
            </div>

            <div>
              <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
              <Input
                id="razorpayKeySecret"
                type="password"
                value={settings.razorpayKeySecret || ''}
                onChange={(e) => handleChange('razorpayKeySecret', e.target.value)}
                placeholder="Enter Razorpay secret key"
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-base font-medium text-gray-900 mb-4">Pricing Configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="defaultPricePerCard">Default Price per Card (₹)</Label>
                  <Input
                    id="defaultPricePerCard"
                    type="number"
                    value={settings.defaultPricePerCard || 5}
                    onChange={(e) => handleChange('defaultPricePerCard', e.target.value)}
                    placeholder="5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used by print partners as base price</p>
                </div>

                <div>
                  <Label htmlFor="minJobAmount">Min Job Amount (₹)</Label>
                  <Input
                    id="minJobAmount"
                    type="number"
                    value={settings.minJobAmount || 500}
                    onChange={(e) => handleChange('minJobAmount', e.target.value)}
                    placeholder="500"
                  />
                </div>

                <div>
                  <Label htmlFor="maxJobAmount">Max Job Amount (₹)</Label>
                  <Input
                    id="maxJobAmount"
                    type="number"
                    value={settings.maxJobAmount || 100000}
                    onChange={(e) => handleChange('maxJobAmount', e.target.value)}
                    placeholder="100000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Email Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
            <p className="text-sm text-gray-600 mt-1">SMTP configuration for email notifications</p>
          </div>
          <Button onClick={handleSaveEmail} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  type="text"
                  value={settings.smtpHost || ''}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.smtpPort || 587}
                  onChange={(e) => handleChange('smtpPort', e.target.value)}
                  placeholder="587"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fromEmailAddress">From Email Address</Label>
              <Input
                id="fromEmailAddress"
                type="email"
                value={settings.fromEmailAddress || ''}
                onChange={(e) => handleChange('fromEmailAddress', e.target.value)}
                placeholder="noreply@myprintbot.com"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            <p className="text-sm text-gray-600 mt-1">Support contact details displayed to partners and clients</p>
          </div>
          <Button onClick={handleSaveContact} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="supportEmail">Support Email Address</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                placeholder="support@myprintbot.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primary support email shown when users' accounts are blocked or need assistance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPhone">Contact Phone Number</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={settings.contactPhone || ''}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <p className="text-xs text-gray-500 mt-1">Phone number shown in partner and client settings</p>
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email Address</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="contact@myprintbot.com"
                />
                <p className="text-xs text-gray-500 mt-1">General contact email shown in partner and client settings</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Referral Program Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Referral Program Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Configure referral rewards and credit rules</p>
          </div>
          <Button onClick={handleSaveReferral} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="referralSignupBonus">Signup Bonus (Referrer) (₹)</Label>
                <Input
                  id="referralSignupBonus"
                  type="number"
                  value={settings.referralSignupBonus || 500}
                  onChange={(e) => handleChange('referralSignupBonus', e.target.value)}
                  placeholder="500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Amount the referrer earns when referee completes their first job
                </p>
              </div>

              <div>
                <Label htmlFor="referralWelcomeBonus">Welcome Bonus (Referee) (₹)</Label>
                <Input
                  id="referralWelcomeBonus"
                  type="number"
                  value={settings.referralWelcomeBonus || 200}
                  onChange={(e) => handleChange('referralWelcomeBonus', e.target.value)}
                  placeholder="200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Amount the new partner gets when they sign up with a referral code
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="referralCreditExpiryMonths">Credit Expiry Period (Months)</Label>
                <Input
                  id="referralCreditExpiryMonths"
                  type="number"
                  value={settings.referralCreditExpiryMonths || 12}
                  onChange={(e) => handleChange('referralCreditExpiryMonths', e.target.value)}
                  placeholder="12"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many months until referral credits expire after being earned
                </p>
              </div>

              <div>
                <Label htmlFor="referralMaxUsagePercent">Max Credit Usage (%)</Label>
                <Input
                  id="referralMaxUsagePercent"
                  type="number"
                  value={settings.referralMaxUsagePercent || 50}
                  onChange={(e) => handleChange('referralMaxUsagePercent', e.target.value)}
                  placeholder="50"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum percentage of a payment that can be paid using referral credits
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">How it works:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>When a new partner signs up with a referral code, they get the Welcome Bonus immediately</li>
                      <li>When the new partner completes their first job, the referrer gets the Signup Bonus</li>
                      <li>Credits expire after the specified number of months</li>
                      <li>Partners can use credits up to the max usage percentage when paying for jobs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-blue-900 mb-1">Configuration Info</h3>
            <p className="text-sm text-blue-800">
              These settings control platform-wide behavior. Changes will affect all users and print partners.
              Make sure to test thoroughly before updating production settings.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
