import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        'https://adminpanelnodeapi.onrender.com/api/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // credentials: 'omit',
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();

      // Assuming API returns token and user info
      dispatch(login({ user: data.user, token: data.token }));
      localStorage.setItem('authToken', data.token);
      if (data?.user.role === "admin") {
        navigate('/todays-orders');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;