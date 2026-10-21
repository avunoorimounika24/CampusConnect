package com.campusconnect.service;

import com.campusconnect.dto.request.LoginRequest;
import com.campusconnect.dto.request.RegisterRequest;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.CustomUserDetailsService;
import com.campusconnect.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User studentUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest(
                "Jane Doe",
                "jane@campus.edu",
                "B210001",
                "Computer Science",
                "3rd Year",
                "Password@123",
                "Password@123"
        );

        loginRequest = new LoginRequest("jane@campus.edu", "Password@123");

        studentUser = new User();
        studentUser.setId(10L);
        studentUser.setFullName("Jane Doe");
        studentUser.setEmail("jane@campus.edu");
        studentUser.setStudentId("B210001");
        studentUser.setRole(Role.ROLE_STUDENT);
        studentUser.setPasswordHash("hashed_pw");
    }

    @Test
    @DisplayName("Should successfully register a new student")
    void testStudentRegistration_Success() {
        when(userRepository.existsByEmail("jane@campus.edu")).thenReturn(false);
        when(userRepository.existsByStudentId("B210001")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("hashed_pw");
        when(userRepository.save(any(User.class))).thenReturn(studentUser);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "jane@campus.edu", "hashed_pw", Collections.emptyList()
        );
        when(userDetailsService.loadUserByUsername("jane@campus.edu")).thenReturn(userDetails);
        when(jwtService.generateToken(any(), eq(10L), eq("ROLE_STUDENT"), eq("Jane Doe"))).thenReturn("mock.jwt.token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("jane@campus.edu", response.getUser().getEmail());
        assertEquals(Role.ROLE_STUDENT, response.getUser().getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when passwords do not match")
    void testRegistration_PasswordMismatch() {
        registerRequest.setConfirmPassword("Mismatch@123");

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should prevent registration with duplicate email")
    void testDuplicateEmailPrevention() {
        when(userRepository.existsByEmail("jane@campus.edu")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should prevent registration with duplicate student ID")
    void testDuplicateStudentIdPrevention() {
        when(userRepository.existsByEmail("jane@campus.edu")).thenReturn(false);
        when(userRepository.existsByStudentId("B210001")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully authenticate valid user login")
    void testSuccessfulLogin() {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "jane@campus.edu", "hashed_pw", Collections.emptyList()
        );
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null, Collections.emptyList()));
        when(userRepository.findByEmail("jane@campus.edu")).thenReturn(Optional.of(studentUser));
        when(jwtService.generateToken(any(), eq(10L), eq("ROLE_STUDENT"), eq("Jane Doe"))).thenReturn("valid.login.jwt");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("valid.login.jwt", response.getToken());
        assertEquals("jane@campus.edu", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should throw exception on invalid login credentials")
    void testInvalidLogin() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid email or password"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }
}
