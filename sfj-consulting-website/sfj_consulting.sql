-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2025 at 08:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sfj_consulting`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `created_at`) VALUES
(1, NULL, 'LOGIN', 'admin logged in', '2025-12-13 14:48:46'),
(2, NULL, 'LOGIN', 'admin logged in', '2025-12-13 14:53:56'),
(3, NULL, 'UPDATE_BOOKING', 'Updated booking #1 status to Terkonfirmasi', '2025-12-13 14:57:00'),
(4, NULL, 'UPDATE_BOOKING', 'Updated booking #1 status to Selesai', '2025-12-13 14:57:06'),
(5, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:04:16'),
(6, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:04:42'),
(7, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:04:57'),
(8, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:07:38'),
(9, NULL, 'UPDATE_BOOKING', 'Updated booking #2 status to Terkonfirmasi', '2025-12-13 15:09:01'),
(10, NULL, 'UPDATE_BOOKING', 'Updated booking #2 status to Selesai', '2025-12-13 15:09:07'),
(11, NULL, 'UPDATE_BOOKING', 'Updated booking #3 status to Dibatalkan', '2025-12-13 15:09:12'),
(12, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:25:23'),
(13, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:25:47'),
(14, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:28:33'),
(15, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:31:40'),
(16, NULL, 'CREATE_DOCUMENT', 'Menambah dokumen: rfhilvwrilfvilwyv', '2025-12-13 15:31:57'),
(17, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:32:08'),
(18, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:41:47'),
(19, NULL, 'CREATE_DOCUMENT', 'Menambah dokumen: ieFIOYVwfiovwif', '2025-12-13 15:42:07'),
(20, NULL, 'UPDATE_DOCUMENT', 'Mengubah dokumen: ieFIOYVwfiovwif', '2025-12-13 15:42:17'),
(21, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:42:26'),
(22, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:43:11'),
(23, NULL, 'DELETE_DOCUMENT', 'Menghapus dokumen: rfhilvwrilfvilwyv', '2025-12-13 15:43:18'),
(24, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:43:23'),
(25, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:43:39'),
(26, NULL, 'CREATE_TEAM', 'Added new team member: Naufal Rakadilah', '2025-12-13 15:49:27'),
(27, NULL, 'UPDATE_TEAM', 'Updated team member: Naufal Rakadilah', '2025-12-13 15:49:40'),
(28, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:49:46'),
(29, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:52:09'),
(30, NULL, 'DELETE_TEAM', 'Deleted team member: Naufal Rakadilah', '2025-12-13 15:52:19'),
(31, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:52:23'),
(32, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:52:36'),
(33, NULL, 'CREATE_USER', 'Created new user: idvow', '2025-12-13 15:56:56'),
(34, NULL, 'UPDATE_USER', 'Updated user: digidaw', '2025-12-13 15:57:32'),
(35, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:57:41'),
(36, NULL, 'LOGIN', 'digidaw logged in', '2025-12-13 15:58:04'),
(37, NULL, 'CREATE_USER', 'Created new user: nopal', '2025-12-13 15:58:51'),
(38, NULL, 'LOGOUT', 'digidaw logged out', '2025-12-13 15:58:57'),
(39, NULL, 'LOGIN', 'admin logged in', '2025-12-13 15:59:22'),
(40, NULL, 'UPDATE_USER', 'Updated user: nopal', '2025-12-13 15:59:35'),
(41, NULL, 'LOGOUT', 'admin logged out', '2025-12-13 15:59:39'),
(42, NULL, 'LOGIN', 'nopal logged in', '2025-12-13 15:59:44'),
(43, NULL, 'DELETE_USER', 'Deleted user: digidaw', '2025-12-13 16:00:03'),
(44, NULL, 'CREATE_USER', 'Created new user: bitch', '2025-12-13 16:00:40'),
(45, NULL, 'DELETE_USER', 'Deleted user: bitch', '2025-12-13 16:00:45'),
(46, NULL, 'CREATE_USER', 'Created new user: sanitra', '2025-12-13 16:04:00'),
(47, NULL, 'LOGOUT', 'nopal logged out', '2025-12-13 16:04:05'),
(48, NULL, 'LOGIN', 'sanitra logged in', '2025-12-13 16:04:12'),
(49, NULL, 'DELETE_USER', 'Deleted user: nopal', '2025-12-13 16:04:18'),
(50, NULL, 'CREATE_USER', 'Created new user: admin1', '2025-12-13 16:05:17'),
(51, NULL, 'DELETE_USER', 'Deleted user: admin', '2025-12-13 16:05:24'),
(52, NULL, 'CREATE_USER', 'Created new user: admin', '2025-12-13 16:05:52'),
(53, NULL, 'DELETE_USER', 'Deleted user: admin1', '2025-12-13 16:05:57'),
(54, NULL, 'LOGOUT', 'sanitra logged out', '2025-12-13 16:06:01'),
(55, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:06:07'),
(56, 7, 'DELETE_USER', 'Deleted user: sanitra', '2025-12-13 16:06:14'),
(57, 7, 'LOGOUT', 'admin logged out', '2025-12-13 16:06:58'),
(58, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:07:43'),
(59, 7, 'LOGOUT', 'admin logged out', '2025-12-13 16:08:11'),
(60, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:14:57'),
(61, 7, 'LOGOUT', 'admin logged out', '2025-12-13 16:29:28'),
(62, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:29:40'),
(63, 7, 'DELETE_REVIEW', 'Deleted review #6', '2025-12-13 16:29:48'),
(64, 7, 'TOGGLE_REVIEW', 'Toggled review #5 to Disembunyikan', '2025-12-13 16:29:51'),
(65, 7, 'TOGGLE_REVIEW', 'Toggled review #4 to Disembunyikan', '2025-12-13 16:29:56'),
(66, 7, 'TOGGLE_REVIEW', 'Toggled review #3 to Disembunyikan', '2025-12-13 16:29:58'),
(67, 7, 'LOGOUT', 'admin logged out', '2025-12-13 16:30:02'),
(68, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:30:17'),
(69, 7, 'TOGGLE_REVIEW', 'Toggled review #3 to Tampil', '2025-12-13 16:30:22'),
(70, 7, 'TOGGLE_REVIEW', 'Toggled review #4 to Tampil', '2025-12-13 16:30:24'),
(71, 7, 'TOGGLE_REVIEW', 'Toggled review #5 to Tampil', '2025-12-13 16:30:26'),
(72, 7, 'LOGOUT', 'admin logged out', '2025-12-13 16:30:29'),
(73, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:32:11'),
(74, 7, 'UPDATE_BOOKING', 'Updated booking #4 status to Terkonfirmasi', '2025-12-13 16:40:11'),
(75, 7, 'UPDATE_BOOKING', 'Updated booking #5 status to Dibatalkan', '2025-12-13 16:40:15'),
(76, 7, 'UPDATE_BOOKING', 'Updated booking #4 status to Selesai', '2025-12-13 16:40:25'),
(77, 7, 'TOGGLE_REVIEW', 'Toggled review #5 to Disembunyikan', '2025-12-13 16:45:59'),
(78, 7, 'TOGGLE_REVIEW', 'Toggled review #4 to Disembunyikan', '2025-12-13 16:46:02'),
(79, 7, 'LOGOUT', 'admin logged out', '2025-12-13 16:46:05'),
(80, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:56:43'),
(81, 7, 'LOGOUT', 'admin logged out', '2025-12-13 16:58:36'),
(82, 7, 'LOGIN', 'admin logged in', '2025-12-13 16:58:55'),
(83, 7, 'CREATE_DOCUMENT', 'Menambah dokumen: hilqe', '2025-12-13 16:59:29'),
(84, 7, 'LOGOUT', 'admin logged out', '2025-12-13 17:00:51'),
(85, 7, 'LOGIN', 'admin logged in', '2025-12-13 17:12:53'),
(86, 7, 'UPDATE_TEAM', 'Updated team member: Soni Fajar S.G', '2025-12-13 17:27:53'),
(87, 7, 'UPDATE_TEAM', 'Updated team member: Andi Agus S.', '2025-12-13 17:28:10'),
(88, 7, 'LOGOUT', 'admin logged out', '2025-12-13 17:28:16'),
(89, 7, 'LOGIN', 'admin logged in', '2025-12-13 17:37:48'),
(90, 7, 'LOGOUT', 'admin logged out', '2025-12-13 17:38:03'),
(91, 7, 'LOGIN', 'admin logged in', '2025-12-13 17:39:00'),
(92, 7, 'UPDATE_TEAM', 'Updated team member: Arian Nurrifqhi', '2025-12-13 17:45:01'),
(93, 7, 'LOGOUT', 'admin logged out', '2025-12-13 17:46:18'),
(94, 7, 'LOGIN', 'admin logged in', '2025-12-13 18:17:52'),
(95, 7, 'UPDATE_GALLERY', 'Mengubah gallery item: Leader in Its Field', '2025-12-13 18:28:27'),
(96, 7, 'LOGOUT', 'admin logged out', '2025-12-13 18:45:11'),
(97, 7, 'LOGIN', 'admin logged in', '2025-12-13 18:45:39'),
(98, 7, 'CREATE_DOCUMENT', 'Menambah dokumen: de dje', '2025-12-13 18:46:05'),
(99, 7, 'LOGOUT', 'admin logged out', '2025-12-13 18:46:10'),
(100, 7, 'LOGIN', 'admin logged in', '2025-12-13 18:50:32'),
(101, 7, 'LOGOUT', 'admin logged out', '2025-12-13 18:53:57');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(50) NOT NULL,
  `service` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `booking_date` date NOT NULL,
  `booking_time` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'Menunggu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `name`, `email`, `company`, `position`, `whatsapp`, `service`, `message`, `booking_date`, `booking_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 'nopals', 'nopals@gmail.com', 'Telkom', 'HR', '57t86689', 'workshop', 'payaaaa', '2025-12-14', '15:00 - 16:00', 'Selesai', '2025-12-13 14:53:34', '2025-12-13 14:57:06'),
(2, 'sani', 'sani@gmail.com', 'Astra', 'Manager', '6578678', 'tata-kelola', 'ggkjbjnjn', '2025-12-25', '14:00 - 15:00', 'Selesai', '2025-12-13 15:06:23', '2025-12-13 15:09:07'),
(3, 'lola', 'lola@gmai.com', 'Telkom', 'Mahasiswa', '68768979080', 'workshop', 'jbkjnlkjlk', '2025-12-31', '13:00 - 14:00', 'Dibatalkan', '2025-12-13 15:07:11', '2025-12-13 15:09:12'),
(4, 'jijah', 'jijah@gmail.com', 'telkom', 'mahasiswa', '0818127523039', 'workshop', 'aku bete aku kesal', '2025-12-31', '10:00 - 11:00', 'Selesai', '2025-12-13 16:31:25', '2025-12-13 16:40:25'),
(5, 'lolak', 'lola@gmail.com', 'kvuCFYW', 'IWHFVUYEW', '23456789', 'layanan-spbe', 'IUFLBIYWOFVIOWGFY', '2025-12-25', '11:00 - 12:00', 'Dibatalkan', '2025-12-13 16:31:56', '2025-12-13 16:40:15'),
(6, 'milaa jila', 'mila@gmail.com', 'astra', 'mahasiswa', '6298765479', 'tata-kelola', 'eb3jk2djk', '2025-12-24', '10:00 - 11:00', 'Menunggu', '2025-12-13 17:37:30', '2025-12-13 17:37:30');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(500) DEFAULT NULL,
  `filesize` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `title`, `category`, `description`, `filename`, `filepath`, `filesize`, `created_at`, `updated_at`) VALUES
(2, 'ieFIOYVwfiovwif', 'Lainnya', 'hkfviyowvfipyWFVIVPFIW', 'WIN_20241209_09_06_06_Pro.jpg', '/uploads/documents/1765640527691-613796929.jpg', '240.21 KB', '2025-12-13 15:42:07', '2025-12-13 15:42:17'),
(3, 'hilqe', 'Layanan SPBE', 'CD Hk.', 'WIN_20241014_08_58_17_Pro.jpg', '/uploads/documents/1765645169321-167129555.jpg', '257.03 KB', '2025-12-13 16:59:29', '2025-12-13 16:59:29'),
(4, 'de dje', 'Tata Kelola & Manajemen SPBE', 'jedjewb', 'Foto Pak Soni.png', '/uploads/documents/1765651565560-869476711.png', '1.65 MB', '2025-12-13 18:46:05', '2025-12-13 18:46:05');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_items`
--

CREATE TABLE `gallery_items` (
  `id` int(11) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery_items`
--

INSERT INTO `gallery_items` (`id`, `image_path`, `title`, `description`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'public/doc/doc_1.jpg', 'Leader in Its Field', 'PT. Solusi Fikir Jenius telah berdiri sejak 2015 di bidang konsultasi transformasi digital dan SPBE. Perusahaan kami bergerak di bidang penyediaan layanan konsultasi strategis, tata kelola TIK, dan implementasi SPBE, dengan lahan operasional seluas lebih dari 2 hektar serta didukung oleh lebih dari 50 tenaga ahli berpengalaman dan berdedikasi tinggi sehingga produk dan layanan kami menjadi pilihan utama bagi instansi pemerintah maupun swasta di Indonesia.', 1, '2025-12-13 16:54:40', '2025-12-13 16:54:40'),
(2, 'public/doc/doc_2.jpg', 'Proyek SPBE Sukses', 'Dalam proyek ini, kami berhasil mengimplementasikan sistem SPBE untuk instansi pemerintah, meningkatkan efisiensi operasional hingga 40%. Tim kami bekerja sama dengan klien untuk memastikan integrasi sempurna dengan infrastruktur existing.', 2, '2025-12-13 16:54:40', '2025-12-13 16:54:40'),
(3, 'public/doc/doc_3.jpg', 'Workshop Pelatihan', 'Workshop pelatihan kami fokus pada pengembangan skill SDM di bidang tata kelola TI. Lebih dari 100 peserta telah mengikuti program ini, dengan feedback positif mengenai pendekatan praktis dan interaktif.', 3, '2025-12-13 16:54:40', '2025-12-13 16:54:40'),
(4, 'public/doc/doc_4.jpg', 'Audit TIK Inovatif', 'Audit TIK kami mencakup evaluasi keamanan dan performa sistem. Hasil audit membantu klien mengidentifikasi risiko dan mengimplementasikan perbaikan yang hemat biaya.', 4, '2025-12-13 16:54:40', '2025-12-13 16:54:40'),
(5, 'public/doc/doc_5.jpg', 'Kolaborasi dengan Vendor', 'Kerja sama dengan lebih dari 60 vendor memungkinkan kami menyediakan solusi teknologi terkini. Dokumentasi ini menunjukkan salah satu proyek kolaboratif yang sukses di sektor publik.', 5, '2025-12-13 16:54:40', '2025-12-13 16:54:40'),
(6, 'public/doc/doc_6.jpg', 'Implementasi SPBE Berhasil', 'Kami telah berhasil mengimplementasikan Sistem Penyelenggaraan Pemerintahan Berbasis Elektronik (SPBE) di beberapa instansi pemerintah daerah. Proyek ini mencakup integrasi aplikasi layanan publik, peningkatan interoperabilitas data antar-OPD, serta penerapan tata kelola TIK yang sesuai regulasi nasional. Hasilnya, efisiensi pelayanan publik meningkat signifikan dan akses masyarakat terhadap layanan digital menjadi lebih mudah dan cepat.', 6, '2025-12-13 16:54:40', '2025-12-13 16:54:40');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `is_anonymous` tinyint(4) DEFAULT 0,
  `comment` text NOT NULL,
  `status` varchar(50) DEFAULT 'Tampil',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `first_name`, `last_name`, `is_anonymous`, `comment`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Anonim', '', 1, 'yagazi', 'Tampil', '2025-12-13 15:03:43', '2025-12-13 15:03:43'),
(2, 'ilwefli', 'hflv', 0, 'jwfvvwef', 'Tampil', '2025-12-13 16:07:24', '2025-12-13 16:07:24'),
(3, 'Anonim', '', 1, 'ekfveuwivlewi', 'Tampil', '2025-12-13 16:08:37', '2025-12-13 16:30:22'),
(4, 'Anonim', '', 1, 'qdbilqeVDBIUQE', 'Disembunyikan', '2025-12-13 16:08:59', '2025-12-13 16:46:02'),
(5, 'Anonim', '', 0, 'EQFBBEQUIDVUQE', 'Disembunyikan', '2025-12-13 16:09:06', '2025-12-13 16:45:59');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `quote` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `position`, `description`, `avatar`, `quote`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Soni Fajar S.G', 'CEO / SPBE Expert', 'Founder & CEO', '/public/team/team_1765646873937-513118544.png', 'Membawa perubahan melalui teknologi untuk masa depan yang lebih baik', 'Aktif', '2025-12-13 14:48:23', '2025-12-13 17:27:53'),
(2, 'Ridha Hanafi', 'COBIT & TOGAF Expert', 'Senior Consultant', NULL, 'Membangun arsitektur pemerintahan yang terintegrasi dan efisien bagi pelayanan publik', 'Aktif', '2025-12-13 14:48:23', '2025-12-13 14:48:23'),
(3, 'Andi Agus S.', 'ITPM & EA Architect', 'Lead Architect', '/public/team/team_1765646890487-211308627.jpg', 'Mewujudkan kebijakan yang mendukung tata kelola digital yang aman dan efektif', 'Aktif', '2025-12-13 14:48:23', '2025-12-13 17:28:10'),
(4, 'Arian Nurrifqhi', 'Digital Transformation Specialist', 'Specialist', NULL, 'Mengubah data menjadi wawasan untuk pelayanan publik yang unggul', 'Aktif', '2025-12-13 14:48:23', '2025-12-13 17:45:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`, `updated_at`) VALUES
(7, 'admin', '$2b$10$g6ug3mzio/qyXM7/DBXAD.m6O5K/YkNFnWWnkCgN9Qf2fvZPUnf9S', 'admin@gmail.com', 'admin', '2025-12-13 16:05:52', '2025-12-13 17:12:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery_items`
--
ALTER TABLE `gallery_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `gallery_items`
--
ALTER TABLE `gallery_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
