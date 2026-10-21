package com.campusconnect.config;

import com.campusconnect.entity.*;
import com.campusconnect.repository.ContactMessageRepository;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.initial-email:admin@campusconnect.edu}")
    private String adminEmail;

    @Value("${app.admin.initial-password:Admin@12345}")
    private String adminPassword;

    @Value("${app.admin.initial-name:Campus Administrator}")
    private String adminName;

    public DataSeeder(UserRepository userRepository,
                      EventRepository eventRepository,
                      EventRegistrationRepository registrationRepository,
                      ContactMessageRepository contactMessageRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAdminUser();
        User sampleStudent = seedSampleStudent();
        List<Event> seededEvents = seedSampleEvents();
        seedSampleRegistrations(sampleStudent, seededEvents);
        seedSampleContactMessage();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFullName(adminName);
            admin.setEmail(adminEmail);
            admin.setStudentId(null);
            admin.setDepartment("Campus Administration");
            admin.setAcademicYear("Staff");
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            logger.info("Initialized default administrator account: {}", adminEmail);
        }
    }

    private User seedSampleStudent() {
        String studentEmail = "student@rgukt.ac.in";
        return userRepository.findByEmail(studentEmail).orElseGet(() -> {
            User student = new User();
            student.setFullName("Avunoori Mounika");
            student.setEmail(studentEmail);
            student.setStudentId("B200001");
            student.setDepartment("Computer Science and Engineering");
            student.setAcademicYear("Final Year (E4)");
            student.setPasswordHash(passwordEncoder.encode("Student@1234"));
            student.setRole(Role.ROLE_STUDENT);
            logger.info("Initialized default demo student account: {}", studentEmail);
            return userRepository.save(student);
        });
    }

    private List<Event> seedSampleEvents() {
        if (eventRepository.count() > 0) {
            return eventRepository.findAll();
        }

        logger.info("Seeding realistic sample events into database...");
        List<Event> events = new ArrayList<>();

        LocalDate today = LocalDate.now();

        // 1. National-Level Hackathon
        Event e1 = new Event();
        e1.setTitle("National-Level Hackathon 2026: CodeSpark");
        e1.setDescription("A premier 36-hour non-stop collegiate hackathon bringing together the finest coders, developers, and innovators across India. Work on cutting-edge problem statements in AI, Cloud Computing, Healthcare, and Smart Campus Solutions. Mentorship from industry veterans and prizes worth ₹1,50,000.");
        e1.setCategory(EventCategory.HACKATHONS);
        e1.setEventDate(today.plusDays(15));
        e1.setStartTime(LocalTime.of(9, 0));
        e1.setEndTime(LocalTime.of(21, 0));
        e1.setVenue("Campus Innovation & Incubation Hub, Hall A");
        e1.setOrganizer("Coding Club & Department of CSE");
        e1.setRegistrationDeadline(LocalDateTime.of(today.plusDays(13), LocalTime.of(23, 59)));
        e1.setCapacity(150);
        e1.setImageUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80");
        e1.setStatus(EventStatus.ACTIVE);
        events.add(e1);

        // 2. Full Stack Development Workshop
        Event e2 = new Event();
        e2.setTitle("Full Stack Web Development with React & Spring Boot");
        e2.setDescription("Hands-on masterclass covering modern full-stack application development. Learn component-driven React architecture, state management, RESTful API design using Spring Boot 3, Spring Data JPA with MySQL, JWT security, and production deployment best practices.");
        e2.setCategory(EventCategory.WORKSHOPS);
        e2.setEventDate(today.plusDays(7));
        e2.setStartTime(LocalTime.of(10, 0));
        e2.setEndTime(LocalTime.of(16, 30));
        e2.setVenue("Central Computing Center, Lab 3");
        e2.setOrganizer("Web Technologies Association");
        e2.setRegistrationDeadline(LocalDateTime.of(today.plusDays(6), LocalTime.of(18, 0)));
        e2.setCapacity(60);
        e2.setImageUrl("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80");
        e2.setStatus(EventStatus.ACTIVE);
        events.add(e2);

        // 3. Cybersecurity Awareness Seminar
        Event e3 = new Event();
        e3.setTitle("Cybersecurity & Ethical Hacking Awareness Seminar");
        e3.setDescription("An insightful seminar on contemporary cyber threats, vulnerability assessments, penetration testing fundamentals, zero-trust security architecture, and defensive engineering. Keynote address by Senior Security Analysts from leading infosec firms.");
        e3.setCategory(EventCategory.SEMINARS);
        e3.setEventDate(today.plusDays(10));
        e3.setStartTime(LocalTime.of(14, 0));
        e3.setEndTime(LocalTime.of(17, 0));
        e3.setVenue("APJ Abdul Kalam Memorial Auditorium");
        e3.setOrganizer("Cyber Security Cell & IEEE Student Branch");
        e3.setRegistrationDeadline(LocalDateTime.of(today.plusDays(9), LocalTime.of(20, 0)));
        e3.setCapacity(200);
        e3.setImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80");
        e3.setStatus(EventStatus.ACTIVE);
        events.add(e3);

        // 4. Annual Cultural Fest
        Event e4 = new Event();
        e4.setTitle("Tarang 2026 - Annual Inter-College Cultural Extravaganza");
        e4.setDescription("The grandest campus celebration of art, music, dance, theatrical performances, and literary competitions. Featuring battle of the bands, classical fusion, pro night celebrity musical concert, street plays, and cultural food carnival.");
        e4.setCategory(EventCategory.CULTURAL);
        e4.setEventDate(today.plusDays(25));
        e4.setStartTime(LocalTime.of(16, 0));
        e4.setEndTime(LocalTime.of(22, 0));
        e4.setVenue("Main University Open Air Amphitheatre");
        e4.setOrganizer("Student Cultural Committee");
        e4.setRegistrationDeadline(LocalDateTime.of(today.plusDays(23), LocalTime.of(23, 59)));
        e4.setCapacity(500);
        e4.setImageUrl("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80");
        e4.setStatus(EventStatus.ACTIVE);
        events.add(e4);

        // 5. Inter-College Sports Tournament
        Event e5 = new Event();
        e5.setTitle("Campus Champions Trophy: Inter-Departmental Sports Tournament");
        e5.setDescription("Annual flagship sporting event featuring football, basketball, cricket, badminton, volleyball, and track events. Open to all registered college students. Trophies, medals, and merit certificates awarded at the valedictory ceremony.");
        e5.setCategory(EventCategory.SPORTS);
        e5.setEventDate(today.plusDays(18));
        e5.setStartTime(LocalTime.of(8, 0));
        e5.setEndTime(LocalTime.of(18, 0));
        e5.setVenue("University Sports Complex & Stadium");
        e5.setOrganizer("Department of Physical Education & Sports Board");
        e5.setRegistrationDeadline(LocalDateTime.of(today.plusDays(16), LocalTime.of(17, 0)));
        e5.setCapacity(120);
        e5.setImageUrl("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80");
        e5.setStatus(EventStatus.ACTIVE);
        events.add(e5);

        // 6. Introduction to Generative AI
        Event e6 = new Event();
        e6.setTitle("Deep Dive into Generative AI & Large Language Models");
        e6.setDescription("Explore the transformer architectures powering modern LLMs, prompt engineering paradigms, retrieval-augmented generation (RAG), vector databases, and agentic AI systems. Live demonstrations of fine-tuning open-weights models and deploying AI agents.");
        e6.setCategory(EventCategory.TECHNICAL);
        e6.setEventDate(today.plusDays(12));
        e6.setStartTime(LocalTime.of(11, 0));
        e6.setEndTime(LocalTime.of(15, 30));
        e6.setVenue("Virtual Seminar Hall & E-Learning Center");
        e6.setOrganizer("AI & Robotics Society");
        e6.setRegistrationDeadline(LocalDateTime.of(today.plusDays(11), LocalTime.of(22, 0)));
        e6.setCapacity(100);
        e6.setImageUrl("https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80");
        e6.setStatus(EventStatus.ACTIVE);
        events.add(e6);

        // 7. E-Cell Startup Pitch & Venture Summit
        Event e7 = new Event();
        e7.setTitle("Ignite 2026: Campus Startup Pitch & Venture Summit");
        e7.setDescription("Student founders pitch startup ideas before angel investors, venture capitalists, and alumni entrepreneurs. Workshops on business model canvas, go-to-market strategies, seed grants, and incubation opportunities at the university innovation hub.");
        e7.setCategory(EventCategory.ENTREPRENEURSHIP);
        e7.setEventDate(today.plusDays(20));
        e7.setStartTime(LocalTime.of(10, 0));
        e7.setEndTime(LocalTime.of(16, 0));
        e7.setVenue("Executive Management Auditorium");
        e7.setOrganizer("Entrepreneurship Cell (E-Cell)");
        e7.setRegistrationDeadline(LocalDateTime.of(today.plusDays(19), LocalTime.of(18, 0)));
        e7.setCapacity(80);
        e7.setImageUrl("https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80");
        e7.setStatus(EventStatus.ACTIVE);
        events.add(e7);

        // 8. Completed Past Event (for demonstrating completed status)
        Event e8 = new Event();
        e8.setTitle("Cloud Computing & DevOps Bootcamp 2026");
        e8.setDescription("Intensive bootcamp on Docker containerization, Kubernetes orchestration, CI/CD pipelines, and multi-cloud architectures. Successfully concluded with practical certification tests.");
        e8.setCategory(EventCategory.TECHNICAL);
        e8.setEventDate(today.minusDays(5));
        e8.setStartTime(LocalTime.of(9, 30));
        e8.setEndTime(LocalTime.of(16, 30));
        e8.setVenue("Computer Center Lab 1");
        e8.setOrganizer("Cloud Computing Group");
        e8.setRegistrationDeadline(LocalDateTime.of(today.minusDays(7), LocalTime.of(23, 59)));
        e8.setCapacity(50);
        e8.setImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80");
        e8.setStatus(EventStatus.COMPLETED);
        events.add(e8);

        return eventRepository.saveAll(events);
    }

    private void seedSampleRegistrations(User student, List<Event> events) {
        if (student == null || events.isEmpty() || registrationRepository.count() > 0) {
            return;
        }

        // Register student for event 1 (Hackathon) and event 2 (Full Stack Workshop)
        if (events.size() >= 2) {
            EventRegistration r1 = new EventRegistration(student, events.get(0), RegistrationStatus.CONFIRMED);
            EventRegistration r2 = new EventRegistration(student, events.get(1), RegistrationStatus.CONFIRMED);
            registrationRepository.saveAll(List.of(r1, r2));
            logger.info("Seeded sample confirmed registrations for student: {}", student.getEmail());
        }
    }

    private void seedSampleContactMessage() {
        if (contactMessageRepository.count() == 0) {
            ContactMessage msg = new ContactMessage(
                    "Rahul Sharma",
                    "rahul.sharma@rgukt.ac.in",
                    "Query regarding CodeSpark Hackathon team size",
                    "Hello CampusConnect Team, could you please clarify if inter-departmental teams are allowed for the CodeSpark Hackathon? Thank you!"
            );
            contactMessageRepository.save(msg);
        }
    }
}
