import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import api from '../../api/axios';
import {
  User,
  Mail,
  Phone,
  Building2,
  Clock,
  Briefcase,
  CreditCard
} from 'lucide-react';

export function EmployeeProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    empId: '',
    client: '',
    department: '',
    email: '',
    phone: '',
    shift: {
      start: '',
      end: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/api/v1/employee/profile');
        const data = response.data;

        setProfileData({
          name: data.name || 'N/A',
          empId: data.employee_id || 'N/A',
          client: data.client || 'N/A',
          department: data.department || 'N/A',
          email: data.email || 'N/A',
          phone: data.phone || 'N/A',
          shift: {
            start: data.shift_timings?.start || 'N/A',
            end: data.shift_timings?.end || 'N/A'
          }
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">
            Manage your personal information and settings
          </p>
        </div>
        <Button variant="outline">
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Identity Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{profileData.name}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {profileData.department}
              </CardDescription>
              <div className="mt-4 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {profileData.empId}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal & Work Details</CardTitle>
            <CardDescription>
              Your contact and employment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Contact Information</h3>

                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{profileData.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{profileData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Work Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Work Information</h3>

                <div>
                  <label className="text-sm text-gray-500">Client / Company</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{profileData.client}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Department</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{profileData.department}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Shift Timings</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {profileData.shift?.start} - {profileData.shift?.end}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
