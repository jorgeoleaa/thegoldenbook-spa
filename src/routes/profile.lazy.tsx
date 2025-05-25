import { createLazyFileRoute } from '@tanstack/react-router';
import { Avatar, Box, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { User } from '../services/proxy/generated';
import { DefaultApi } from '../services/proxy/generated';
import { UpdateUserRequest, DeleteUserRequest } from '../services/proxy/generated/apis/DefaultApi';

export const Route = createLazyFileRoute('/profile')({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  const api = new DefaultApi();

  const authenticatedUser: User | null = JSON.parse(sessionStorage.getItem('authenticatedUser') || 'null');

  useEffect(() => {
    if (!authenticatedUser) {
      console.log("There is no authenticated user");
      navigate({ to: "/login" });
    } else {
      console.log("Authenticated user:", authenticatedUser);
    }
  }, [authenticatedUser, navigate]);

  if (!authenticatedUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
        <Typography variant="h6" color="text.secondary">
          There is no authenticated user. Please log in.
        </Typography>
      </Box>
    );
  }

  const handleEditClick = () => {
    setOriginalUser({ ...authenticatedUser });
    setEditedUser({ ...authenticatedUser });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editedUser) {

      const updateClienteRequest: UpdateUserRequest = {
        user: editedUser,
        locale: "es_ES"
      }

      api.updateUser(updateClienteRequest);
      sessionStorage.setItem('authenticatedUser', JSON.stringify(editedUser));
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setEditedUser(originalUser);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleDeleteClick = async () => {

    const request: DeleteUserRequest = {
      id: authenticatedUser.id!,
      locale: "es_ES"
    }
    await api.deleteUser(request);
    sessionStorage.removeItem("authenticatedUser");

    navigate({to: "/"});
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
      <Card sx={{ maxWidth: 500, width: '100%', p: 3, borderRadius: 4, boxShadow: 3 }}>
        <CardContent>
          {/* User profile */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 80, height: 80, mb: 2 }} src="/profile-pic.jpg" alt="User Profile" />
            {isEditing ? (
              <>
                <TextField name="name" value={editedUser?.name || ''} onChange={handleChange} margin="normal" />
                <TextField name="lastName" value={editedUser?.lastName || ''} onChange={handleChange} margin="normal" />
                <TextField name="secondLastName" value={editedUser?.secondLastName || ''} onChange={handleChange} margin="normal" />
              </>
            ) : (
              <Typography variant="h5" fontWeight="bold">
                {authenticatedUser.name} {authenticatedUser.lastName} {authenticatedUser.secondLastName}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {authenticatedUser.email}
            </Typography>
          </Box>

          {/* User information */}
          <Box mt={3}>
            {[
              { label: 'Nickname', field: 'nickname' },
              { label: 'National ID', field: 'nationalId' },
              { label: 'Phone', field: 'phoneNumber'},
              { label: 'Email', field: 'email' },
              { label: 'Password', field: 'password', isPassword: true },
            ].map(({ label, field, isPassword }) => (
              <Box key={field} mb={2}>
                <Typography variant="body1" fontWeight="bold">{label}:</Typography>
                {isEditing ? (
                  <TextField
                    name={field}
                    value={editedUser?.[field as keyof User] ?? ''}
                    onChange={handleChange}
                    fullWidth
                    type={isPassword ? 'password' : 'text'}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {isPassword
                      ? String(authenticatedUser[field as keyof User]).replace(/./g, '*')
                      : String(authenticatedUser[field as keyof User])
                    }
                  </Typography>
                )}
              </Box>
            ))}

            <Box mb={2}>
              <Typography variant="body1" fontWeight="bold">Address:</Typography>
              {isEditing ? (
                <TextField
                  name="addresses"
                  value={editedUser?.addresses?.join(', ') || ''}
                  onChange={handleChange}
                  fullWidth
                />
              ) : (
                authenticatedUser.addresses && Array.isArray(authenticatedUser.addresses) && authenticatedUser.addresses.length > 0 ? (
                  authenticatedUser.addresses.map((address, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      {"No address data available"}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No address available</Typography>
                )
              )}
            </Box>
          </Box>

          {/* Edit, Save, and Cancel buttons */}
          <Box display="flex" justifyContent="center" mt={3}>
            {isEditing ? (
              <>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveClick} sx={{ borderRadius: 2, mr: 2 }}>
                  Save
                </Button>
                <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancelClick} sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditClick} sx={{ borderRadius: 2 }}>
                  Edit profile
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                  sx={{ borderRadius: 2 }}
                >
                  Delete account
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}