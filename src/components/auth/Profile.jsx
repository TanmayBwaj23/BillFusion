import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Globe, Languages, CheckCircle, AlertCircle, Edit2, X, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { SkeletonInput, SkeletonCard } from '../ui/Skeleton';
import { ButtonLoading } from '../ui/LoadingOverlay';
import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import { showSuccess, showError } from '../../lib/toast';
import { profileUpdateSchema } from '../../schemas/authSchemas';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      timezone: '',
      language: '',
    }
  });

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await authService.getCurrentUser();
        
        // Update form with user data
        reset({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          timezone: userData.timezone || 'UTC',
          language: userData.language || 'en',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  // Handle profile update submission
  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      // Update profile via API
      const updatedUser = await authService.updateProfile(user?.id, data);
      
      // Update local store
      updateUser(updatedUser);
      
      // Reset form with new data
      reset(data);
      
      // Show success message
      setSuccess(true);
      setIsEditing(false);
      
      // Show success toast (Requirement 5.4)
      showSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      const validationErrors = err.response?.data?.error_details || err.response?.data?.details;
      
      let displayError;
      if (validationErrors) {
        displayError = `Validation error: ${JSON.stringify(validationErrors)}`;
      } else {
        displayError = errorMessage;
      }
      
      setError(displayError);
      // Show error toast (Requirement 5.5)
      showError(displayError);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      timezone: user?.timezone || 'UTC',
      language: user?.language || 'en',
    });
    setIsEditing(false);
    setError(null);
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'N/A';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <SkeletonInput label={false} className="w-48 h-8" />
              <SkeletonInput label={false} className="w-64 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <SkeletonInput label={false} className="w-32 h-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonInput />
                <SkeletonInput />
                <SkeletonInput />
              </div>
            </div>
            <div className="space-y-4">
              <SkeletonInput label={false} className="w-32 h-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonInput />
                <SkeletonInput />
                <SkeletonInput />
                <SkeletonInput />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and manage your account details
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Read-only fields */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="text-lg font-semibold">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    {user?.email || 'N/A'}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    {formatRole(user?.role)}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Account Status
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user?.status === 'active' ? 'bg-green-100 text-green-800' :
                      user?.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      user?.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {formatStatus(user?.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    First Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        {...register('first_name')}
                        type="text"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter first name"
                      />
                      {errors.first_name && (
                        <p className="text-sm text-red-600 mt-1">{errors.first_name.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {user?.first_name || 'N/A'}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Last Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        {...register('last_name')}
                        type="text"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter last name"
                      />
                      {errors.last_name && (
                        <p className="text-sm text-red-600 mt-1">{errors.last_name.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {user?.last_name || 'N/A'}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter phone number (optional)"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {user?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Timezone
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        {...register('timezone')}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Shanghai">Shanghai</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                      {errors.timezone && (
                        <p className="text-sm text-red-600 mt-1">{errors.timezone.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {user?.timezone || 'UTC'}
                    </div>
                  )}
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Language
                  </label>
                  {isEditing ? (
                    <div>
                      <select
                        {...register('language')}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                      </select>
                      {errors.language && (
                        <p className="text-sm text-red-600 mt-1">{errors.language.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {user?.language === 'en' ? 'English' :
                       user?.language === 'es' ? 'Spanish' :
                       user?.language === 'fr' ? 'French' :
                       user?.language === 'de' ? 'German' :
                       user?.language === 'zh' ? 'Chinese' :
                       user?.language === 'ja' ? 'Japanese' :
                       user?.language || 'English'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isSaving || !isDirty}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <ButtonLoading text="Saving..." />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;