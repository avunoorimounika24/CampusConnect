package com.campusconnect.dto.response;

import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String studentId;
    private String department;
    private String academicYear;
    private Role role;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String email, String studentId, String department, String academicYear, Role role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.studentId = studentId;
        this.department = department;
        this.academicYear = academicYear;
        this.role = role;
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) return null;
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getStudentId(),
                user.getDepartment(),
                user.getAcademicYear(),
                user.getRole()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
