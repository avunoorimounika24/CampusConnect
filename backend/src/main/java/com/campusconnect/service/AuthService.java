package com.campusconnect.service;

import com.campusconnect.dto.request.LoginRequest;
import com.campusconnect.dto.request.RegisterRequest;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.dto.response.UserResponse;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.CustomUserDetailsService;
import com.campusconnect.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with this email address already exists");
        }

        String studentId = request.getStudentId().trim().toUpperCase();
        if (userRepository.existsByStudentId(studentId)) {
            throw new DuplicateResourceException("An account with this Student ID already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setStudentId(studentId);
        user.setDepartment(request.getDepartment().trim());
        user.setAcademicYear(request.getAcademicYear().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        // Security rule: Students can never self-register as ADMIN
        user.setRole(Role.ROLE_STUDENT);

        User savedUser = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails, savedUser.getId(), savedUser.getRole().name(), savedUser.getFullName());

        return new AuthResponse(token, UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails, user.getId(), user.getRole().name(), user.getFullName());

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    public UserResponse getCurrentUserProfile() {
        User user = getCurrentAuthenticatedUser();
        if (user == null) {
            throw new ResourceNotFoundException("Not authenticated");
        }
        return UserResponse.fromEntity(user);
    }
}
