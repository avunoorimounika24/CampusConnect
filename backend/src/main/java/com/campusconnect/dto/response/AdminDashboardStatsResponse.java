package com.campusconnect.dto.response;

import java.util.List;

public class AdminDashboardStatsResponse {

    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long totalRegistrations;
    private long totalStudents;
    private List<RegistrationResponse> recentRegistrations;

    public AdminDashboardStatsResponse() {
    }

    public AdminDashboardStatsResponse(long totalEvents, long upcomingEvents, long completedEvents, long totalRegistrations, long totalStudents, List<RegistrationResponse> recentRegistrations) {
        this.totalEvents = totalEvents;
        this.upcomingEvents = upcomingEvents;
        this.completedEvents = completedEvents;
        this.totalRegistrations = totalRegistrations;
        this.totalStudents = totalStudents;
        this.recentRegistrations = recentRegistrations;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public long getCompletedEvents() {
        return completedEvents;
    }

    public void setCompletedEvents(long completedEvents) {
        this.completedEvents = completedEvents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public List<RegistrationResponse> getRecentRegistrations() {
        return recentRegistrations;
    }

    public void setRecentRegistrations(List<RegistrationResponse> recentRegistrations) {
        this.recentRegistrations = recentRegistrations;
    }
}
