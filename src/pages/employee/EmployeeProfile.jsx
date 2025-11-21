import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Bell,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export function EmployeeProfile() {
  const [profileData, setProfileData] = useState({
    personal: {},
    company: {},
    preferences: {},
    security: {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Mock employee profile data
    const mockProfileData = {
      personal: {
        empId: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@techcorp.com',
        phone: '+91-9876543210',
        alternatePhone: '+91-9876543211',
        address: {
          line1: 'Apartment 301, Green Valley Residency',
          line2: 'Electronic City Phase 1',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560100'
        },
        dateOfBirth: '1990-05-15',
        joinDate: '2023-01-15',
        emergencyContact: {
          name: 'Jane Doe',
          relation: 'Spouse',
          phone: '+91-9876543212'
        }
      },
      company: {
        name: 'TechCorp Solutions',
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        reportingManager: 'Sarah Wilson',
        managerEmail: 'sarah.wilson@techcorp.com',
        workLocation: 'Koramangala Office',
        employeeType: 'Full Time',
        workingHours: '09:30 AM - 06:30 PM',
        weeklyOffs: ['Saturday', 'Sunday']
      },
      preferences: {
        notifications: {
          tripReminders: true,
          incentiveUpdates: true,
          reportGeneration: true,
          systemAlerts: false
        },
        commute: {
          preferredPickupTime: '09:00 AM',
          preferredReturnTime: '06:45 PM',
          preferredVendor: 'Swift Transport',
          specialRequirements: 'AC vehicle preferred'
        }
      },
      security: {
        lastPasswordChange: '2024-09-15',
        twoFactorEnabled: false,
        loginAlerts: true
      }
    };
    setProfileData(mockProfileData);
    setEditedData(mockProfileData);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
    // In real app, this would make an API call to update the profile
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (section, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, nestedField, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: {
          ...prev[section][nestedField],
          [field]: value
        }
      }
    }));
  };

  const handlePreferenceChange = (section, field, value) => {
    setEditedData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [section]: {
          ...prev.preferences[section],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{profileData.personal?.name}</CardTitle>
              <CardDescription className="text-lg">
                {profileData.personal?.empId} • {profileData.company?.designation}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your basic personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.personal?.name || ''}
                  onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{profileData.personal?.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.personal?.email || ''}
                  onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{profileData.personal?.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.personal?.phone || ''}
                  onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{profileData.personal?.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedData.personal?.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatDate(profileData.personal?.dateOfBirth)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-medium mb-4">Home Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.personal?.address?.line1 || ''}
                    onChange={(e) => handleNestedInputChange('personal', 'address', 'line1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <span>{profileData.personal?.address?.line1}</span>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.personal?.address?.line2 || ''}
                    onChange={(e) => handleNestedInputChange('personal', 'address', 'line2', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <span>{profileData.personal?.address?.line2}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.personal?.address?.city || ''}
                    onChange={(e) => handleNestedInputChange('personal', 'address', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <span>{profileData.personal?.address?.city}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.personal?.address?.pincode || ''}
                    onChange={(e) => handleNestedInputChange('personal', 'address', 'pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <span>{profileData.personal?.address?.pincode}</span>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="font-medium mb-4">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.personal?.emergencyContact?.name || ''}
                    onChange={(e) => handleNestedInputChange('personal', 'emergencyContact', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <span>{profileData.personal?.emergencyContact?.name}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.personal?.emergencyContact?.relation || ''}
                    onChange={(e) => handleNestedInputChange('personal', 'emergencyContact', 'relation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <span>{profileData.personal?.emergencyContact?.relation}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedData.personal?.emergencyContact?.phone || ''}
                    onChange={(e) => handleNestedInputChange('personal', 'emergencyContact', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <span>{profileData.personal?.emergencyContact?.phone}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Your employment details and work information (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span>{profileData.company?.name}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <span>{profileData.company?.department}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <span>{profileData.company?.designation}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reporting Manager
              </label>
              <span>{profileData.company?.reportingManager}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{profileData.company?.workLocation}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </label>
              <span>{profileData.company?.workingHours}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Join Date
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{formatDate(profileData.personal?.joinDate)}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Type
              </label>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {profileData.company?.employeeType}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Manage your notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(profileData.preferences?.notifications || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditing ? editedData.preferences?.notifications?.[key] : value}
                    onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Commute Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Commute Preferences</CardTitle>
            <CardDescription>
              Your default commute settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Pickup Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  value={editedData.preferences?.commute?.preferredPickupTime?.replace(/\s?[AP]M/i, '') || ''}
                  onChange={(e) => handlePreferenceChange('commute', 'preferredPickupTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <span>{profileData.preferences?.commute?.preferredPickupTime}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Return Time
              </label>
              {isEditing ? (
                <input
                  type="time"
                  value={editedData.preferences?.commute?.preferredReturnTime?.replace(/\s?[AP]M/i, '') || ''}
                  onChange={(e) => handlePreferenceChange('commute', 'preferredReturnTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <span>{profileData.preferences?.commute?.preferredReturnTime}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Vendor
              </label>
              {isEditing ? (
                <select
                  value={editedData.preferences?.commute?.preferredVendor || ''}
                  onChange={(e) => handlePreferenceChange('commute', 'preferredVendor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Swift Transport">Swift Transport</option>
                  <option value="City Cabs">City Cabs</option>
                  <option value="Metro Rides">Metro Rides</option>
                </select>
              ) : (
                <span>{profileData.preferences?.commute?.preferredVendor}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              {isEditing ? (
                <textarea
                  value={editedData.preferences?.commute?.specialRequirements || ''}
                  onChange={(e) => handlePreferenceChange('commute', 'specialRequirements', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <span>{profileData.preferences?.commute?.specialRequirements}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Password Change
              </label>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-gray-500" />
                <span>{formatDate(profileData.security?.lastPasswordChange)}</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Change Password
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Two-Factor Authentication
              </label>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  profileData.security?.twoFactorEnabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profileData.security?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Button variant="outline" size="sm">
                  {profileData.security?.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
