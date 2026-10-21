package com.campusconnect.repository;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    Optional<Event> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT e FROM Event e WHERE " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.organizer) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:eventDate IS NULL OR e.eventDate = :eventDate) AND " +
           "(:status IS NULL OR e.status = :status)")
    Page<Event> searchEvents(
            @Param("search") String search,
            @Param("category") EventCategory category,
            @Param("eventDate") LocalDate eventDate,
            @Param("status") EventStatus status,
            Pageable pageable
    );

    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' AND e.eventDate >= :today ORDER BY e.eventDate ASC, e.startTime ASC")
    List<Event> findFeaturedUpcomingEvents(@Param("today") LocalDate today, Pageable pageable);

    long countByStatus(EventStatus status);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.eventDate >= :today AND e.status = 'ACTIVE'")
    long countUpcomingEvents(@Param("today") LocalDate today);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.eventDate < :today OR e.status = 'COMPLETED'")
    long countCompletedEvents(@Param("today") LocalDate today);
}
