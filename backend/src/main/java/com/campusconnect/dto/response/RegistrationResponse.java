package com.campusconnect.dto.response;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class RegistrationResponse {

    private Long id;
    private Long eventId;
    private String eventTitle;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String venue;
    private EventCategory category;
    private String eventImageUrl;
    private LocalDateTime registrationDate;
    private RegistrationStatus status;

    // Student Details
    private Long userId;
    private String studentName;
    private String studentEmail;
    private String studentId;
    private String department;
    private String academicYear;

    public RegistrationResponse() {
    }

    public static RegistrationResponse fromEntity(EventRegistration reg) {
        if (reg == null) return null;
        RegistrationResponse resp = new RegistrationResponse();
        resp.setId(reg.getId());
        resp.setRegistrationDate(reg.getRegistrationDate());
        resp.setStatus(reg.getRegistrationStatus());

        Event event = reg.getEvent();
        if (event != null) {
            resp.setEventId(event.getId());
            resp.setEventTitle(event.getTitle());
            resp.setEventDate(event.getEventDate());
            resp.setStartTime(event.getStartTime());
            resp.setEndTime(event.getEndTime());
            resp.setVenue(event.getVenue());
            resp.setCategory(event.getCategory());
            resp.setEventImageUrl(event.getImageUrl());
        }

        User user = reg.getUser();
        if (user != null) {
            resp.setUserId(user.getId());
            resp.setStudentName(user.getFullName());
            resp.setStudentEmail(user.getEmail());
            resp.setStudentId(user.getStudentId());
            resp.setDepartment(user.getDepartment());
            resp.setAcademicYear(user.getAcademicYear());
        }

        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public EventCategory getCategory() {
        return category;
    }

    public void setCategory(EventCategory category) {
        this.category = category;
    }

    public String getEventImageUrl() {
        return eventImageUrl;
    }

    public void setEventImageUrl(String eventImageUrl) {
        this.eventImageUrl = eventImageUrl;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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
}
