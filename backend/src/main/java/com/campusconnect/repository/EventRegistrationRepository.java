package com.campusconnect.repository;

import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.RegistrationStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    @Query("SELECT r FROM EventRegistration r JOIN FETCH r.event e WHERE r.user.id = :userId ORDER BY r.registrationDate DESC")
    List<EventRegistration> findByUserIdWithEvent(@Param("userId") Long userId);

    Optional<EventRegistration> findByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByUserIdAndEventIdAndRegistrationStatus(Long userId, Long eventId, RegistrationStatus status);

    long countByEventIdAndRegistrationStatus(Long eventId, RegistrationStatus status);

    long countByUserIdAndRegistrationStatus(Long userId, RegistrationStatus status);

    @Query("SELECT r FROM EventRegistration r JOIN FETCH r.user u WHERE r.event.id = :eventId ORDER BY r.registrationDate DESC")
    List<EventRegistration> findByEventIdWithUser(@Param("eventId") Long eventId);

    @Query("SELECT r FROM EventRegistration r JOIN FETCH r.user u JOIN FETCH r.event e ORDER BY r.registrationDate DESC")
    List<EventRegistration> findRecentRegistrations(Pageable pageable);

    long countByRegistrationStatus(RegistrationStatus status);
}
