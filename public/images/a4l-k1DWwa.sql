-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2024 at 09:25 AM
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
-- Database: `antoine_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`id`, `category_name`, `created_at`, `updated_at`) VALUES
(32, ' PORTRAITS', '2024-11-13 12:22:42', '2024-11-13 12:22:42'),
(33, 'STREET PHOTOGRAPHY', '2024-11-13 12:23:00', '2024-11-13 12:23:00'),
(34, ' DANCE', '2024-11-13 12:23:13', '2024-11-13 12:23:13'),
(35, 'FASHION', '2024-11-13 12:23:23', '2024-11-13 12:23:23');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_contact`
--

CREATE TABLE `tbl_contact` (
  `id` int(11) NOT NULL,
  `frist_name` varchar(200) NOT NULL,
  `last_name` varchar(200) NOT NULL,
  `company` text NOT NULL,
  `email` varchar(50) NOT NULL,
  `language` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_contact`
--

INSERT INTO `tbl_contact` (`id`, `frist_name`, `last_name`, `company`, `email`, `language`, `created_at`, `updated_at`) VALUES
(7, 'Abhhishek', 'Lodhi', 'Creative Thoughts Informatics Pvt. Ltd.', 'abhisheklodhi641@gmail.com', 'English', '2024-11-14 11:02:12', '2024-11-14 11:02:12'),
(8, 'Abhhishek', 'Lodhi', 'Creative Thoughts Informatics Pvt. Ltd.', 'abhisheklodhi641@gmail.com', 'English', '2024-11-14 11:04:10', '2024-11-14 11:04:10'),
(9, 'Cooper', 'Harper', 'Asher', 'Francis@gmail.com', 'English', '2024-11-14 11:05:34', '2024-11-14 11:05:34'),
(10, 'Lara', 'Yasir', 'Tanek', 'Aurelia@gmail.com', 'Spanish', '2024-11-14 11:08:39', '2024-11-14 11:08:39');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_image`
--

CREATE TABLE `tbl_image` (
  `id` int(11) NOT NULL,
  `category_id` text NOT NULL,
  `subcategory_id` text DEFAULT NULL,
  `subsubcategoryid` varchar(255) DEFAULT NULL,
  `image_unique_id` int(20) NOT NULL,
  `file` varchar(200) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `dimensions` varchar(200) NOT NULL,
  `tag_id` text NOT NULL,
  `subtag_id` text DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `collaburate_status` enum('0','1','2','3') NOT NULL DEFAULT '2' COMMENT '0 => Request, 1 => Pending, 2 => Accept, 3 => Reject',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_image`
--

INSERT INTO `tbl_image` (`id`, `category_id`, `subcategory_id`, `subsubcategoryid`, `image_unique_id`, `file`, `title`, `dimensions`, `tag_id`, `subtag_id`, `user_id`, `collaburate_status`, `created_at`, `updated_at`) VALUES
(227, '33', '39', '8', 104026, 'd2170628-531-558x372.jpg', 'Maiores facere', '372*558', '53,22,13', '16,12,14,15', 10, '2', '2024-11-26 07:34:28', '2024-11-26 07:34:28'),
(228, '33', '39', '9', 682150, 'd2170629-0429-558x432.jpg', 'Veritatis eos irure', '432*558', '46,43,41', NULL, 10, '2', '2024-11-26 07:35:01', '2024-11-26 07:35:01'),
(230, '32', '36', '6', 994968, '20240815141830-4ef4d165-me.jpg', 'Vel occaecat amet', '594*594', '51,48,45,38,40,41', '19,8,18', 10, '2', '2024-11-26 07:36:00', '2024-11-26 07:36:00'),
(231, '32', '41', NULL, 853561, '1708691108601.jpg', 'Auctions', '1080*1620', '53', NULL, 10, '2', '2024-11-26 07:36:07', '2024-11-26 07:36:07'),
(232, '32', '41', '11', 853561, '1708691108601.jpg', 'Auctions', '1080*1620', '53', NULL, 10, '2', '2024-11-26 07:36:07', '2024-11-26 07:36:07'),
(233, '32', '36', '7', 597406, 'd2130430-531-1-558x558.jpg', 'Praesentium voluptat', '558*558', '46,41,40,38', NULL, 10, '2', '2024-11-26 07:36:31', '2024-11-26 07:36:31'),
(234, '34', NULL, NULL, 734499, 'd2170629-0429-558x432.jpg', 'Minus culpa consect', '432*558', '13,12', '15,10,11', 10, '2', '2024-11-26 07:37:12', '2024-11-26 07:37:12'),
(235, '35', NULL, NULL, 562089, 'plant.jpg', 'pexels padri', '600*600', '53,29,31', NULL, 10, '2', '2024-11-26 07:37:51', '2024-11-26 07:37:51'),
(236, '35', '40', NULL, 562089, 'plant.jpg', 'pexels padri', '600*600', '53,29,31', NULL, 10, '2', '2024-11-26 07:37:51', '2024-11-26 07:37:51'),
(237, '34', NULL, NULL, 562089, 'plant.jpg', 'pexels padri', '600*600', '53,29,31', NULL, 10, '2', '2024-11-26 07:37:51', '2024-11-26 07:37:51'),
(238, '33', NULL, NULL, 562089, 'plant.jpg', 'pexels padri', '600*600', '53,29,31', NULL, 10, '2', '2024-11-26 07:37:51', '2024-11-26 07:37:51'),
(241, '32', '36', '6', 669396, '20240815143941-a95c5d0b-sq.jpg', 'Congolese musician, composer, and pianist Ray Lema photographed at hôtel Djolof in Dakar during Ateliers de la Pensée 2022.', '120*120', '45,48,49', '18,8', 10, '2', '2024-11-26 07:50:01', '2024-11-26 07:50:01'),
(242, '32', '38', NULL, 848194, 'd2160320-055-768x768.jpg', 'Débris de Justice', '768*768', '41,36,27', NULL, 26, '0', '2024-11-26 08:13:10', '2024-11-26 08:24:48'),
(243, '33', '39', '9', 834042, 'zair_ak_batine-558x558.jpg', 'Zaïr ak Batine : Xel nangouwoul', '558*558', '51,46,42,41,48', '19,8', 26, '0', '2024-11-26 08:21:17', '2024-11-26 08:24:19');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_log_download_image`
--

CREATE TABLE `tbl_log_download_image` (
  `id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_rating_comment`
--

CREATE TABLE `tbl_rating_comment` (
  `id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `rating` decimal(20,1) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_subcategory`
--

CREATE TABLE `tbl_subcategory` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_subcategory`
--

INSERT INTO `tbl_subcategory` (`id`, `category_id`, `subcategory_name`, `created_at`, `updated_at`) VALUES
(36, 32, ' STUDIO', '2024-11-13 12:23:42', '2024-11-13 12:23:42'),
(37, 32, ' CONCEPTUELS', '2024-11-13 12:23:57', '2024-11-13 12:23:57'),
(38, 32, ' ON THE SPOT', '2024-11-13 12:24:12', '2024-11-13 12:24:12'),
(39, 33, ' AFRICA', '2024-11-13 12:24:33', '2024-11-13 12:24:33'),
(40, 35, 'NEW YORK', '2024-11-13 12:24:43', '2024-11-21 10:32:59'),
(41, 32, ' PERFORMANCE', '2024-11-13 12:25:14', '2024-11-21 08:29:49');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sub_subcategory`
--

CREATE TABLE `tbl_sub_subcategory` (
  `id` int(11) NOT NULL,
  `sub_categoryId` int(11) DEFAULT NULL,
  `sub_sub_categoryName` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='change table name';

--
-- Dumping data for table `tbl_sub_subcategory`
--

INSERT INTO `tbl_sub_subcategory` (`id`, `sub_categoryId`, `sub_sub_categoryName`, `created_at`, `updated_at`) VALUES
(6, 36, 'passport', '2024-11-26 12:55:55', '2024-11-26 12:55:55'),
(7, 36, 'full-size', '2024-11-26 12:56:14', '2024-11-26 12:56:14'),
(8, 39, 'live-show', '2024-11-26 12:56:51', '2024-11-26 12:56:51'),
(9, 39, 'funny', '2024-11-26 12:57:02', '2024-11-26 12:57:02'),
(10, 41, 'stage', '2024-11-26 12:57:24', '2024-11-26 12:57:24'),
(11, 41, 'singing', '2024-11-26 12:57:53', '2024-11-26 12:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sub_tag`
--

CREATE TABLE `tbl_sub_tag` (
  `id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `sub_tagName` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_sub_tag`
--

INSERT INTO `tbl_sub_tag` (`id`, `tag_id`, `sub_tagName`, `created_at`, `updated_at`) VALUES
(8, 48, 'movies', '2024-11-26 13:01:31', '2024-11-26 13:01:31'),
(9, 48, 'TV shows', '2024-11-26 13:01:46', '2024-11-26 13:01:46'),
(10, 12, 'girls', '2024-11-26 13:02:11', '2024-11-26 13:02:11'),
(11, 12, 'boys', '2024-11-26 13:02:25', '2024-11-26 13:02:25'),
(12, 53, 'slum ', '2024-11-26 13:02:41', '2024-11-26 13:02:41'),
(13, 13, 'solo', '2024-11-26 13:02:57', '2024-11-26 13:02:57'),
(14, 22, 'riser', '2024-11-26 13:03:02', '2024-11-26 13:03:02'),
(15, 13, 'group', '2024-11-26 13:03:22', '2024-11-26 13:03:22'),
(16, 53, 'coli', '2024-11-26 13:03:26', '2024-11-26 13:03:26'),
(17, 50, 'hippo', '2024-11-26 13:04:02', '2024-11-26 13:04:02'),
(18, 45, 'auctions', '2024-11-26 13:04:14', '2024-11-26 13:04:14'),
(19, 51, 'Avibaran', '2024-11-26 13:04:33', '2024-11-26 13:04:33');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tag`
--

CREATE TABLE `tbl_tag` (
  `id` int(11) NOT NULL,
  `tag` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_tag`
--

INSERT INTO `tbl_tag` (`id`, `tag`, `created_at`, `updated_at`) VALUES
(5, 'stage', '2024-10-24 06:10:14', '2024-10-24 06:10:14'),
(6, 'followup', '2024-10-24 06:10:27', '2024-10-24 06:10:27'),
(9, 'Advertising', '2024-10-25 07:47:37', '2024-10-25 07:47:37'),
(10, '80s', '2024-10-25 07:48:28', '2024-10-25 07:48:28'),
(11, '90s', '2024-10-25 07:48:33', '2024-10-25 07:48:33'),
(12, 'African ', '2024-10-25 07:49:18', '2024-10-25 07:49:18'),
(13, 'American dance', '2024-10-25 07:49:21', '2024-10-25 07:49:21'),
(14, 'African Art ', '2024-10-25 07:49:38', '2024-10-25 07:49:38'),
(15, 'African artist', '2024-10-25 07:49:41', '2024-10-25 07:49:41'),
(16, 'African contemporary art', '2024-10-25 07:50:15', '2024-10-25 07:50:15'),
(17, ' African contemporary dance', '2024-10-25 07:50:18', '2024-10-25 07:50:18'),
(18, 'African dance', '2024-10-25 07:50:29', '2024-10-25 07:50:29'),
(19, ' African philosophy', '2024-10-25 07:50:31', '2024-10-25 07:50:31'),
(20, 'African photography ', '2024-10-25 07:50:48', '2024-10-25 07:50:48'),
(21, 'Amanda Kerdahi M', '2024-10-25 07:50:50', '2024-10-25 07:50:50'),
(22, 'Amina Diaw ', '2024-10-25 09:24:04', '2024-10-25 09:24:04'),
(23, 'architecture', '2024-10-25 09:24:07', '2024-10-25 09:24:07'),
(24, 'art africain', '2024-10-25 10:30:34', '2024-10-25 10:30:34'),
(25, 'art contemporain ', '2024-10-25 10:31:03', '2024-10-25 10:31:03'),
(26, 'art curator', '2024-10-25 10:31:07', '2024-10-25 10:31:07'),
(27, 'art institution', '2024-10-25 10:31:40', '2024-10-25 10:31:40'),
(28, 'artiste visuel contemporain', '2024-10-25 10:31:44', '2024-10-25 10:31:44'),
(29, 'Ateliers de la Pensée ', '2024-10-25 10:34:13', '2024-10-25 10:34:13'),
(30, 'attire:nu', '2024-10-25 10:34:16', '2024-10-25 10:34:16'),
(31, 'attire:nude ', '2024-10-25 10:37:56', '2024-10-25 10:37:56'),
(32, 'attire:traditional ', '2024-10-25 10:38:01', '2024-10-25 10:38:01'),
(33, 'attitude:arms crossed ', '2024-10-25 10:38:21', '2024-10-25 10:38:21'),
(34, 'attitude:averted gaze', '2024-10-25 10:38:23', '2024-10-25 10:38:23'),
(35, 'attitude:direct gaze ', '2024-10-25 10:38:52', '2024-10-25 10:38:52'),
(36, 'attitude:smoking ', '2024-10-25 10:38:57', '2024-10-25 10:38:57'),
(37, 'BAM ', '2024-10-25 10:39:02', '2024-10-25 10:39:02'),
(38, 'beach ', '2024-10-25 10:39:06', '2024-10-25 10:39:06'),
(40, 'bonhomme ', '2024-10-25 10:41:08', '2024-10-25 10:41:08'),
(41, 'bonhommes ', '2024-10-25 10:41:16', '2024-10-25 10:41:16'),
(42, 'bras croisés ', '2024-10-25 10:41:33', '2024-10-25 10:41:33'),
(43, 'Brooklyn Academy of Music ', '2024-10-25 10:41:43', '2024-10-25 10:41:43'),
(44, 'Cali ', '2024-10-25 10:41:47', '2024-10-25 10:41:47'),
(45, 'choreographer', '2024-10-25 10:41:50', '2024-10-25 10:41:50'),
(46, 'Christopha Mali', '2024-10-25 10:42:06', '2024-10-25 10:42:06'),
(47, 'cineaste', '2024-10-25 10:46:00', '2024-10-25 10:46:00'),
(48, 'cinéma ', '2024-10-25 10:46:06', '2024-10-25 10:46:06'),
(49, 'africain ', '2024-10-25 10:46:13', '2024-11-08 14:27:04'),
(50, 'city:Bamako ', '2024-10-25 10:46:21', '2024-10-25 10:46:21'),
(51, 'city:Cotonou', '2024-10-25 10:46:30', '2024-10-25 10:46:30'),
(53, 'city: Dakar', '2024-10-25 10:46:52', '2024-10-25 10:46:52');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `role` enum('0','1','2','3') NOT NULL COMMENT '0 => Admin, 1 => Subadmin, 2 => Collaborator, 3 => User',
  `permission` varchar(200) NOT NULL,
  `login_token` text DEFAULT NULL,
  `login_status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 => Not login, 1 => Login',
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0 => Inactive, 1 => Active',
  `verify_status` enum('0','1','2') NOT NULL COMMENT '0 => Pending, 1 => Approved, 2 => Disapproved',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `phone`, `password`, `role`, `permission`, `login_token`, `login_status`, `status`, `verify_status`, `created_at`, `updated_at`) VALUES
(10, 'Admin', 'admin@gmail.com', '1234567890', '$2b$10$nae.MbfoWodY6wgXOHxny.IZL0c8x/KANYiuX7SyOSZiqVBLVCIUa', '0', '[{\"CA\":true},{\"HA\":true},{\"CT\":true},{\"UI\":true},{\"AR\":true},{\"AC\":true},{\"DNI\":true},{\"HIP\":true}]', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzMyNjA2MDA4LCJleHAiOjE3MzI2OTI0MDh9.DC0Pl9R3oaFDjV4AXE6n0v1NnH9Jjg9X2GTm0m9rhcg', '1', '1', '1', '2024-10-18 05:46:27', '2024-11-26 07:26:48'),
(26, 'Gagan', 'gagan.ctinfotech@gmail.com', '+919977418921', '$2b$10$AaU.lqBnYhjPP7x2pViuwukswjTqV.EGDSHEuyxTk1zZbRiByTPD.', '2', '[{\"CA\":false},{\"HA\":false},{\"CT\":false},{\"UI\":false},{\"AR\":false},{\"AC\":false},{\"DNI\":false},{\"HIP\":false}]', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImVtYWlsIjoiZ2FnYW4uY3RpbmZvdGVjaEBnbWFpbC5jb20iLCJpYXQiOjE3MzI1MzU3MzUsImV4cCI6MTczMjYyMjEzNX0.jP2gnkGKl45wx-XlqRtpj6MZw6_v3KKjWzr5NDjhhH0', '1', '1', '1', '2024-11-13 12:22:09', '2024-11-25 11:55:35'),
(27, 'Harshit', 'harhitbargal059@gmail.com', '+919685422828', '$2b$10$MA57NNk.xi3uHe0SaLD12eZabmh3SYZT01nMaQpwke.ODfgGav09S', '3', '[{\"CA\":false},{\"HA\":false},{\"DA\":false},{\"CL\":false},{\"HIP\":false}]', NULL, '0', '1', '0', '2024-11-14 07:23:28', '2024-11-14 07:23:28');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_website_category`
--

CREATE TABLE `tbl_website_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_website_category`
--

INSERT INTO `tbl_website_category` (`id`, `category_name`, `created_at`, `updated_at`) VALUES
(1, 'FINE ART', '2024-11-07 13:45:47', '2024-11-07 13:45:47'),
(2, 'PHOTOJOURNALISM', '2024-11-07 13:46:32', '2024-11-07 13:46:32'),
(3, 'EXHIBITIONS', '2024-11-07 13:46:55', '2024-11-07 13:46:55'),
(5, 'NEWS', '2024-11-07 13:47:25', '2024-11-07 13:47:25');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_website_image`
--

CREATE TABLE `tbl_website_image` (
  `id` int(11) NOT NULL,
  `website_category_id` int(11) NOT NULL,
  `website_subcategory_id` int(11) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_website_image`
--

INSERT INTO `tbl_website_image` (`id`, `website_category_id`, `website_subcategory_id`, `title`, `description`, `image`, `user_id`, `created_at`, `updated_at`) VALUES
(33, 1, 1, NULL, NULL, '75068-01-04-pr-558x558.jpg', 10, '2024-11-13 11:54:37', '2024-11-13 11:54:37'),
(34, 1, 1, NULL, NULL, 'Abdou-Gadiaga-d2150415-0919-830x830.jpg', 10, '2024-11-13 11:54:37', '2024-11-13 11:54:37'),
(35, 1, 1, NULL, NULL, 'Jems-Koko-Bi-2014-954A9561-2-558x558.jpg', 10, '2024-11-13 11:54:37', '2024-11-13 11:54:37'),
(36, 1, 2, NULL, NULL, 'd2160407-084-558x558.jpg', 10, '2024-11-13 11:55:30', '2024-11-13 11:55:30'),
(37, 1, 2, NULL, NULL, 'IMGP3214-558x558.jpg', 10, '2024-11-13 11:55:30', '2024-11-13 11:55:30'),
(38, 2, 8, NULL, NULL, '85933-C5-08-768x768.jpg', 10, '2024-11-13 11:56:14', '2024-11-13 11:56:14'),
(39, 2, 8, NULL, NULL, '2041126-04-04-558x558.jpg', 10, '2024-11-13 11:56:14', '2024-11-13 11:56:14'),
(40, 2, 8, NULL, NULL, '2061022-01-07-558x558.jpg', 10, '2024-11-13 11:56:14', '2024-11-13 11:56:14'),
(41, 2, 8, NULL, NULL, 'BourÃ©-Diouf-horsecart-driver-Ouakam-2015.-Â©-antoine-tempÃ©-d2150327-299-830x830.jpg', 10, '2024-11-13 11:56:14', '2024-11-13 11:56:14'),
(42, 2, 8, NULL, NULL, 'd2160212-1381-1024x1024.jpg', 10, '2024-11-13 11:56:14', '2024-11-13 11:56:14'),
(43, 2, 10, NULL, NULL, '30690-65-10-558x372.jpg', 10, '2024-11-13 11:57:34', '2024-11-13 11:57:34'),
(44, 2, 10, NULL, NULL, 'd2120207-1228-558x372.jpg', 10, '2024-11-13 11:57:34', '2024-11-13 11:57:34'),
(45, 2, 10, NULL, NULL, 'd2170630-0180-558x558.jpg', 10, '2024-11-13 11:57:34', '2024-11-13 11:57:34'),
(46, 3, 11, NULL, NULL, '30690-65-10-558x372.jpg', 10, '2024-11-13 12:02:55', '2024-11-13 12:02:55'),
(47, 3, 11, NULL, NULL, '34749-35-19-558x380.jpg', 10, '2024-11-13 12:02:55', '2024-11-13 12:02:55'),
(48, 3, 12, NULL, NULL, 'Screenshot (9).png', 10, '2024-11-13 12:03:15', '2024-11-13 12:03:15'),
(49, 3, 12, NULL, NULL, 'Screenshot (17).png', 10, '2024-11-13 12:03:15', '2024-11-13 12:03:15'),
(50, 3, 16, NULL, NULL, 'Screenshot (15).png', 10, '2024-11-13 12:03:34', '2024-11-13 12:03:34'),
(51, 3, 16, NULL, NULL, 'Screenshot (20).png', 10, '2024-11-13 12:03:34', '2024-11-13 12:03:34'),
(52, 3, 16, NULL, NULL, 'Screenshot (22).png', 10, '2024-11-13 12:03:34', '2024-11-13 12:03:34'),
(53, 3, 16, NULL, NULL, 'Screenshot (23).png', 10, '2024-11-13 12:03:34', '2024-11-13 12:03:34'),
(54, 5, NULL, 'YCOS-Project will present two bodies of work by photographer Antoine Tempé at the AKAA art fair at Carreau du Temple in Paris, from Nov. 9—11, 2018', '<h4 style=\"text-align:start\"><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">*** PRESS RELEASE ***</span></span></strong></h4><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">&nbsp;</span></span></p><h4 style=\"text-align:start\"><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">On the occasion of the AKAA art fair, YCOS-Project will be exhibiting two bodies of work by photographer Antoine Tempé. “WAA DAKAR” (</span></span></strong><em><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">“People of Dakar”</span></span></strong></em><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\"> in Wolof) is a series of portraits of women and men whose professional activities take place in the streets of Dakar, the capital of Senegal. “Débris de Justice” </span></span></strong><em><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">(“The Ruins of Law”)</span></span></strong></em><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\"> narrates an abandoned architectural space, the vacated House of Justice of the city of Dakar.</span></span></strong></h4><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">&nbsp;</span></span></p><h4 style=\"text-align:start\"><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">“WAA DAKAR”</span></span></strong></h4><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Since the beginning of the millenium, Dakar, the capital of Senegal, has been changing at a fast pace. The white city sitting on its </span></span><em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">cape verde</span></span></em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\"> has been developing rapidly; its colonial houses and its </span></span><em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">pénc</span></span></em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\"> – the traditional </span></span><em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">lébou</span></span></em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\"> villages – giving way to tasteless buildings and houses; its sand streets being replaced by asphalt roads and paved sidewalks.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Alongside these changes, some trades, legacies from the city’s past, endure. The </span></span><em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">borom saret</span></span></em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">, the horse cart driver to which the Senegalese filmmaker Sembène Ousmane paid tribute; the “Soleil” peddler, who sells the daily newspaper, dear to another movie director, Djibril Diop Mambéty; the fishmonger; and so many more who to this day, remain indispensable in the Dakarois’ daily life.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Feeling that these trades might soon disappear from the streets of Africa’s capitals, and with them a certain memory of the city, the photographer Antoine Tempé, himself a Dakarois by adoption, wishes to shine a light onto these craftsmen and women. In keeping with his documentary work on contemporary Africa, this body of work of Tempé’s will remain an important archive once these professions have disappeared from the cityscape.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">&nbsp;</span></span></p><h4 style=\"text-align:start\"><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">“Débris de Justice” </span></span></strong><em><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">(“The Ruins of Law”)</span></span></strong></em></h4><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">“Débris de Justice” is a series of photographs taken inside the dilapidated former Hall of Justice of the city of Dakar, right before it was rehabilitated as the venue for the international exhibition of the Dakar Biennale in 2016. &nbsp;</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">In this series which hangs between a testimonial piece and a plea, the cracked walls, the abandoned objects, the floors strewn with legal documents lost forever, bring the evocation of a justice in pieces, of erased lives, in a post-cataclysmic landscape which is nonetheless consumed with a surreal beauty.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">This series was met with an enthusiastic reception when it was initially presented as a video installation; at the Dakar Biennale in 2016; in the exhibition“Afriques Capitales” at grande halle de la Villette in Paris in 2017; in the exhibition “African Metropolis” at MAXXI museum in Rome in 2018. YCOS-Project is proud to exhibit for the first time photographic prints of this series.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">&nbsp;</span></span></p><h4 style=\"text-align:start\"><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">Antoine Tempé :</span></span></strong></h4><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">French-American photographer. Lives and works in Dakar.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">It is in New York where he settled in the mid-eighties that Antoine Tempé acquired a passion for photography. There he realized his first photographic assignments on American dance companies as well as on New York City’s nightlife which he covered for European publications. In 2000, he set about to travel through West Africa and Madagascar, where his discovery contemporary African dance was like a revelation; this new passion led him to produce the series ‘“Dancers of Africa” and Faces of Africa”.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Antoine Tempé has always been fascinated by the way in which a photographic portrait becomes a window into the subject’s soul. His portraits are easily recognizable through their minimalistic style, like in his recent series “WAA DAKAR” and “Face-to-Face”. Antoine Tempé also likes to explore the recent transformations of Africa’s large metropolises, and in particular that of the city of Dakar where he has been living for close to 10 years. His images are striking by their simplicity infused with an acute sense of aesthetics.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">&nbsp;</span></span></p><h4 style=\"text-align:start\"><strong><span style=\"color:rgb(51, 51, 51);\"><span style=\"background-color:rgb(255, 255, 255);\">YCOS-Project :</span></span></strong></h4><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Founded in 2017, by art collector Olivier Salomon and curator and art critic Yves Chatap, YCOS-Project is a production agency whose vocation is to work alongside artists, helping them with curatorial development and production, as well as valorizing and marketing their projects</span></span><em><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">.&nbsp;</span></span></em></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">YCOS-Project was conceived as a bridge between the artists on one side, and art institutions and galleries on the other side. It aims to foster contemporary arts production, with an emphasis on the fields of photography and visual arts.&nbsp;</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Capitalizing on its founders expertise, YCOS-Project is keen on developing a south-south approach by promoting new dialogues between Africa, South America and South-East Asia. It aims to advance a new understanding of the historical and cultural links between these geographic areas.&nbsp; YCOS-Project contribues to the vitality of these various artistic scenes through the organization of exhibitions and artists’ residences for its artists. The combined competences of an art collector and a curator furthers a dynamic and complementarity analysis of its projects.</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\"><img src=\"https://gallery.mailchimp.com/d16fc74fe24946089df77762d/images/1528fe82-16bf-4108-a0bc-f1acec7e8023.png\" width=\"480\"></span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">AKAA Also Known As Africa<br>Carreau du Temple<br>4, rue Eugène Spuller<br>75003 Paris</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Friday 9 Nov. 12 – 7:30 pm<br>Saturday 10 Nov. &nbsp;12 – 9 pm<br>Sunday 11 Nov. 12 – 7 pm</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Tickets : 16.00€ (reduced 10.00€, free for kids below 12 )</span></span></p><p style=\"text-align:start\"><span style=\"color:rgb(107, 107, 107);\"><span style=\"background-color:rgb(255, 255, 255);\">Press images </span></span><a href=\"mailto: antoine@antoinetempe.com?subject=press%20images%20request\"><span style=\"color:rgb(0, 92, 135);\"><span style=\"background-color:transparent;\">available upon request</span></span></a></p>', 'AKAA_Tempe-1482x350.jpg', 10, '2024-11-13 12:05:30', '2024-11-13 12:05:30');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_website_subcategory`
--

CREATE TABLE `tbl_website_subcategory` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_name` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_website_subcategory`
--

INSERT INTO `tbl_website_subcategory` (`id`, `category_id`, `subcategory_name`, `created_at`, `updated_at`) VALUES
(1, 1, 'FACE-A-FACES', '2024-11-07 13:48:26', '2024-11-07 13:48:26'),
(2, 1, 'DEBRIS DE JUSTICE', '2024-11-07 13:48:47', '2024-11-07 13:48:47'),
(3, 1, 'WAA DAKAR', '2024-11-07 13:49:02', '2024-11-07 13:49:02'),
(4, 1, 'THEORIE DES REGNES SENSIBLES', '2024-11-07 13:49:52', '2024-11-07 13:49:52'),
(5, 1, '[RE-]MIXING HOLLYWOOD', '2024-11-07 13:50:23', '2024-11-07 13:50:23'),
(6, 1, 'DANCES', '2024-11-07 13:50:35', '2024-11-07 13:50:35'),
(7, 1, 'MOOD|MOVES', '2024-11-07 13:51:00', '2024-11-07 13:51:00'),
(8, 2, 'DKR/TNR', '2024-11-07 13:51:40', '2024-11-07 13:51:40'),
(9, 2, 'DFW17', '2024-11-07 13:51:55', '2024-11-07 13:51:55'),
(10, 2, 'CHRONICILE OF A REVOLT', '2024-11-07 13:52:26', '2024-11-07 13:52:26'),
(11, 3, 'CHRONOLOGY', '2024-11-07 13:53:12', '2024-11-07 13:53:12'),
(12, 3, 'DÉBRIS DE JUSTICE', '2024-11-07 13:53:29', '2024-11-07 14:02:58'),
(14, 3, 'FACE À FACES', '2024-11-07 13:54:03', '2024-11-07 14:02:47'),
(15, 3, '[RE-]MIXING HOLLYWOOD', '2024-11-07 13:54:31', '2024-11-07 13:54:31'),
(16, 3, 'WAA DAKAR [work in progress]', '2024-11-07 14:01:31', '2024-11-07 14:02:25'),
(17, 3, 'THÉORIE DES RÈGNES SENSIBLES', '2024-11-07 14:02:11', '2024-11-07 14:02:11'),
(18, 4, 'MAGAZINES', '2024-11-07 14:03:47', '2024-11-07 14:04:21'),
(19, 4, 'NEWSPAPERS', '2024-11-07 14:04:45', '2024-11-07 14:04:45'),
(20, 4, 'ADVERTISING', '2024-11-07 14:05:01', '2024-11-07 14:05:01'),
(21, 4, 'BILLBOARD/POSTERS', '2024-11-07 14:05:26', '2024-11-07 14:05:26'),
(22, 4, 'ART BOOKS/CATALOGUES', '2024-11-07 14:05:53', '2024-11-07 14:05:53'),
(23, 4, 'MUSIC', '2024-11-07 14:06:07', '2024-11-07 14:06:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_contact`
--
ALTER TABLE `tbl_contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_image`
--
ALTER TABLE `tbl_image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_log_download_image`
--
ALTER TABLE `tbl_log_download_image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_rating_comment`
--
ALTER TABLE `tbl_rating_comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_subcategory`
--
ALTER TABLE `tbl_subcategory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `tbl_sub_subcategory`
--
ALTER TABLE `tbl_sub_subcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_sub_tag`
--
ALTER TABLE `tbl_sub_tag`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_tag`
--
ALTER TABLE `tbl_tag`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_website_category`
--
ALTER TABLE `tbl_website_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_website_image`
--
ALTER TABLE `tbl_website_image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_website_subcategory`
--
ALTER TABLE `tbl_website_subcategory`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `tbl_contact`
--
ALTER TABLE `tbl_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_image`
--
ALTER TABLE `tbl_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT for table `tbl_log_download_image`
--
ALTER TABLE `tbl_log_download_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_rating_comment`
--
ALTER TABLE `tbl_rating_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_subcategory`
--
ALTER TABLE `tbl_subcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `tbl_sub_subcategory`
--
ALTER TABLE `tbl_sub_subcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_sub_tag`
--
ALTER TABLE `tbl_sub_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tbl_tag`
--
ALTER TABLE `tbl_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `tbl_website_category`
--
ALTER TABLE `tbl_website_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_website_image`
--
ALTER TABLE `tbl_website_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `tbl_website_subcategory`
--
ALTER TABLE `tbl_website_subcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_subcategory`
--
ALTER TABLE `tbl_subcategory`
  ADD CONSTRAINT `category_forgenkey` FOREIGN KEY (`category_id`) REFERENCES `tbl_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
