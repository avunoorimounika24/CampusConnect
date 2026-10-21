package com.campusconnect.dto.response;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private EventCategory category;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String venue;
    private String organizer;
    private LocalDateTime registrationDeadline;
    private Integer capacity;
    private String imageUrl;
    private EventStatus status;
    private long registeredCount;
    private long remainingSeats;
    private boolean isRegistered;
    private boolean isFull;
    private boolean isPastDeadline;

    public EventResponse() {
    }

    public static EventResponse fromEntity(Event event, long registeredCount, boolean isRegistered) {
        if (event == null) return null;
        EventResponse resp = new EventResponse();
        resp.setId(event.getId());
        resp.setTitle(event.getTitle());
        resp.setDescription(event.getDescription());
        resp.setCategory(event.getCategory());
        resp.setEventDate(event.getEventDate());
        resp.setStartTime(event.getStartTime());
        resp.setEndTime(event.getEndTime());
        resp.setVenue(event.getVenue());
        resp.setOrganizer(event.getOrganizer());
        resp.setRegistrationDeadline(event.getRegistrationDeadline());
        resp.setCapacity(event.getCapacity());
        resp.setImageUrl(event.getImageUrl());
        resp.setStatus(event.getStatus());
        resp.setRegisteredCount(registeredCount);
        long remaining = Math.max(0, event.getCapacity() - registeredCount);
        resp.setRemainingSeats(remaining);
        resp.setRegistered(isRegistered);
        resp.setFull(remaining <= 0);
        resp.setPastDeadline(event.getRegistrationDeadline() != null && LocalDateTime.now().isAfter(event.getRegistrationDeadline()));
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public EventCategory getCategory() {
        return category;
    }

    public void setCategory(EventCategory category) {
        this.category = category;
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

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public LocalDateTime getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDateTime registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public long getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(long registeredCount) {
        this.registeredCount = registeredCount;
    }

    public long getRemainingSeats() {
        return remainingSeats;
    }

    public void setRemainingSeats(long remainingSeats) {
        this.remainingSeats = remainingSeats;
    }

    public boolean isRegistered() {
        return isRegistered;
    }

    public void setRegistered(boolean registered) {
        isRegistered = registered;
    }

    public boolean isFull() {
        return isFull;
    }

    public void setFull(boolean full) {
        isFull = full;
    }

    public boolean isPastDeadline() {
        return isPastDeadline;
    }

    public void setPastDeadline(boolean pastDeadline) {
        isPastDeadline = pastDeadline;
    }
}
