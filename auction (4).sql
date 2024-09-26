-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2024 at 05:04 PM
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
-- Database: `auction`
--

-- --------------------------------------------------------

--
-- Table structure for table `buy_sell_transactions`
--

CREATE TABLE `buy_sell_transactions` (
  `transaction_id` varchar(255) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `amount` decimal(20,2) NOT NULL,
  `is_buy_now` int(11) NOT NULL,
  `is_max_bid` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `buy_status` varchar(255) NOT NULL DEFAULT '1' COMMENT '1- Waiting for delivery\r\n2- Pending\r\n3- Complete\r\n4- Cancelled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buy_sell_transactions`
--

INSERT INTO `buy_sell_transactions` (`transaction_id`, `buyer_id`, `seller_id`, `product_id`, `offer_id`, `amount`, `is_buy_now`, `is_max_bid`, `created_at`, `updated_at`, `buy_status`) VALUES
('j1t0UJmiBnvx', 22, 11, 2, 1, 1500.00, 1, 0, '2024-09-25 10:21:38', '2024-09-25 10:21:38', '1');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `cat_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `cat_name`, `description`, `created_at`, `updated_at`, `product_id`) VALUES
(1, 'Antiques & Art', '', '2024-07-12 16:30:51', '2024-07-12 16:30:51', 0),
(2, 'Audio, TV & Video', '', '2024-07-12 16:30:51', '2024-07-12 16:30:51', 0),
(3, 'Stamps', '', '2024-07-12 16:30:53', '2024-07-12 16:31:00', 0),
(4, 'Books & Comics', '', '2024-07-12 16:30:53', '2024-07-12 16:31:07', 0),
(5, 'Office & Commercial', '', '2024-07-12 16:32:06', '2024-07-12 16:32:06', 0),
(6, 'Photo & Optics', '', '2024-07-12 16:32:06', '2024-07-12 16:38:47', 0),
(7, 'Watches & Jewellery', '', '2024-07-12 16:37:19', '2024-07-12 16:40:02', 0),
(8, 'Computers & Network', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(9, 'Vehicles', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(10, 'Vehicle accessories', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(11, 'Movies & Series', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(12, 'Games & game consoles', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(13, 'Mobile, landline, radio', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(14, 'Household', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(15, 'Child & Baby', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(16, 'Cosmetics & Care', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(17, 'Music & Musical Instruments', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(18, 'Coins', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(19, 'Toys & Crafts', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(20, 'Sports', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(21, 'Tickets & Vouchers', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(22, 'Pet accessories', '', '2024-07-12 16:37:19', '2024-07-12 16:37:19', 0),
(23, 'Wine & Enjoyment', '', '2024-07-12 16:37:19', '2024-07-12 16:40:09', 0);

-- --------------------------------------------------------

--
-- Table structure for table `favourites_offer`
--

CREATE TABLE `favourites_offer` (
  `user_id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favourites_offer`
--

INSERT INTO `favourites_offer` (`user_id`, `offer_id`, `created_at`, `updated_at`) VALUES
(11, 2, '2024-09-25 10:37:03', '2024-09-25 10:37:03');

-- --------------------------------------------------------

--
-- Table structure for table `offers_created`
--

CREATE TABLE `offers_created` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `product_type` varchar(255) NOT NULL,
  `condition_desc` text NOT NULL,
  `reference_no` varchar(255) NOT NULL,
  `is_bid_or_fixed` tinyint(4) NOT NULL COMMENT '1 is Bid \r\n0 is fixed',
  `start_price` decimal(20,2) NOT NULL,
  `increase_step` int(11) NOT NULL,
  `buyto_price` decimal(20,2) DEFAULT NULL,
  `fixed_offer_price` decimal(20,2) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `length_oftime` int(11) NOT NULL,
  `images_id` int(11) NOT NULL,
  `offerStart` varchar(255) NOT NULL,
  `actual_end_time` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `start_date` datetime NOT NULL DEFAULT current_timestamp(),
  `end_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `offfer_buy_status` int(11) NOT NULL DEFAULT 0 COMMENT '0 -  not bought\r\n1 - bought',
  `is_reactivable` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 - Cannot be reactivated\r\n1-- Can be reactivated',
  `no_of_times_reactivated` int(11) NOT NULL DEFAULT 0,
  `is_psuggestion_enable` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 - Cannot Suggest Price \r\n1- Can suggest Price'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offers_created`
--

INSERT INTO `offers_created` (`id`, `product_id`, `title`, `product_type`, `condition_desc`, `reference_no`, `is_bid_or_fixed`, `start_price`, `increase_step`, `buyto_price`, `fixed_offer_price`, `duration`, `length_oftime`, `images_id`, `offerStart`, `actual_end_time`, `created_at`, `updated_at`, `start_date`, `end_date`, `user_id`, `offfer_buy_status`, `is_reactivable`, `no_of_times_reactivated`, `is_psuggestion_enable`) VALUES
(1, 2, 'Kotak camera', 'Action cam', '<p>Testing</p>', 'undefined', 1, 1000.00, 1, 1500.00, 0.00, 1500, 1, 1, '2024-09-24 19:25:00', '', '2024-09-24 13:55:19', '2024-09-24 13:55:19', '2024-09-24 19:25:00', '2024-09-25 19:25:00', 11, 1, 0, 0, 0),
(2, 8, 'Samsung Mobile', 'TV', '<p><em>Testing</em></p>', '235', 1, 200.00, 5, 1500.00, 0.00, 1500, 1, 2, '2024-09-25 15:44:00', '', '2024-09-25 10:14:31', '2024-09-25 10:14:31', '2024-09-25 15:44:00', '2024-09-26 15:44:00', 22, 0, 0, 0, 0),
(3, 7, 'Audi A8', 'Car', '<p>Testing</p>', 'undefined', 0, 0.00, 1, NULL, 25000.00, 1500, 1, 3, '2024-09-25 16:15:00', '', '2024-09-25 10:45:36', '2024-09-25 10:45:36', '2024-09-25 16:15:00', '2024-09-26 16:15:00', 11, 0, 0, 0, 1),
(7, 7, 'Verna 65', 'Car', '<p>Testing</p>', 'undefined', 1, 3500.00, 5, 9000.00, 0.00, 1500, 1, 5, '2024-09-26 17:45:00', '', '2024-09-26 17:46:01', '2024-09-26 17:46:01', '2024-09-26 17:45:00', '2024-09-27 17:45:00', 11, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `offer_condition_mapping`
--

CREATE TABLE `offer_condition_mapping` (
  `offer_id` int(11) NOT NULL,
  `condition_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `condition_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offer_condition_mapping`
--

INSERT INTO `offer_condition_mapping` (`offer_id`, `condition_id`, `product_id`, `condition_value`) VALUES
(1, 1, 2, 'Needed'),
(2, 1, 8, 'Needed'),
(3, 1, 7, 'Needed'),
(7, 1, 7, 'Needed');

-- --------------------------------------------------------

--
-- Table structure for table `offer_images`
--

CREATE TABLE `offer_images` (
  `id` int(11) NOT NULL,
  `main_image` varchar(255) NOT NULL,
  `bottom_eside` varchar(255) NOT NULL,
  `top_eside` varchar(255) NOT NULL,
  `tilted_eside` varchar(255) NOT NULL,
  `defects` varchar(255) NOT NULL,
  `details` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `dimension` varchar(255) NOT NULL,
  `accessories` varchar(255) NOT NULL,
  `context` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offer_images`
--

INSERT INTO `offer_images` (`id`, `main_image`, `bottom_eside`, `top_eside`, `tilted_eside`, `defects`, `details`, `brand`, `dimension`, `accessories`, `context`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'oiRHpls8jq.jpg', 'I2wbf8FXU5.jpg', '', '', '', '', '', '', '', '', '2024-09-24 13:55:15', '2024-09-24 13:55:15', 11),
(2, 'Szqvg6XrnJ.jpg', '', '', '', '', '', '', '', '', '', '2024-09-25 10:13:41', '2024-09-25 10:13:41', 22),
(3, 'oCxGl3hqp1.jpg', '', '', '', '', '', '', '', '', '', '2024-09-25 10:44:50', '2024-09-25 10:44:50', 11),
(4, 'cQHVwBo_Mf.jpg', '', '', '', '', '', '', '', '', '', '2024-09-26 17:30:38', '2024-09-26 17:30:38', 11),
(5, '-NYMk0Z_jf.jpg', '', '', '', '', '', '', '', '', '', '2024-09-26 17:45:20', '2024-09-26 17:45:20', 11),
(6, '2CTpf3uZPZ.jpg', '', '', '', '', '', '', '', '', '', '2024-09-26 19:49:22', '2024-09-26 19:49:22', 11);

-- --------------------------------------------------------

--
-- Table structure for table `offer_proattr_mapping`
--

CREATE TABLE `offer_proattr_mapping` (
  `offer_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `attribute_value` varchar(255) DEFAULT NULL,
  `subattribute_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offer_proattr_mapping`
--

INSERT INTO `offer_proattr_mapping` (`offer_id`, `attribute_id`, `product_id`, `attribute_value`, `subattribute_id`) VALUES
(1, 11, 2, 'Dash cam', 0),
(1, 16, 2, 'JVC', 0),
(1, 19, 2, 'Gray', 0),
(2, 88, 8, '4kTVs', 0),
(2, 91, 8, '45', 0),
(2, 92, 8, 'Amazon', 0),
(3, 68, 7, 'Audi', 19),
(3, 71, 7, 'Petrol', 0),
(3, 79, 7, 'Manual transmission', 0),
(3, 81, 7, '25555', 0),
(3, 82, 7, '2024-09-25', 0),
(3, 84, 7, '2024-09-25', 0),
(3, 86, 7, 'Taupe', 0),
(4, 1, 7, 'Waste Bin', 0),
(4, 68, 7, 'Audi', 20),
(5, 1, 7, 'Waste Bin', 0),
(5, 68, 7, 'Audi', 20),
(6, 1, 7, 'Waste Bin', 0),
(6, 68, 7, 'Audi', 20),
(7, 68, 7, 'Audi', 20),
(7, 86, 7, 'Gray', 0);

-- --------------------------------------------------------

--
-- Table structure for table `price_suggestion`
--

CREATE TABLE `price_suggestion` (
  `offer_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Open' COMMENT 'Open \r\nApproved\r\nRejected\r\n',
  `price` decimal(20,3) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_suggestion`
--

INSERT INTO `price_suggestion` (`offer_id`, `seller_id`, `buyer_id`, `status`, `price`, `created_at`, `updated_at`) VALUES
(3, 11, 20, 'Rejected', 20000.000, '2024-09-25 10:51:24', '2024-09-25 10:51:24');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `is_category` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `sku`, `category_id`, `is_category`, `created_at`, `updated_at`) VALUES
(1, 'Trash can', '', '', 14, 1, '2024-07-12 15:41:45', '2024-07-12 16:42:37'),
(2, 'Action cam', '', '', 6, 1, '2024-07-12 16:05:50', '2024-07-12 16:41:24'),
(3, 'Recording devices', '', '', 2, 1, '2024-07-31 06:08:22', '2024-07-31 07:09:46'),
(4, 'Speaker', '', '', 2, 1, '2024-07-31 06:09:13', '2024-07-31 07:09:55'),
(5, 'Book', '', '', 4, 1, '2024-07-31 06:09:47', '2024-07-31 08:19:31'),
(6, 'Computer', '', '', 8, 1, '2024-07-31 06:10:40', '2024-07-31 09:27:01'),
(7, 'Car', '', '', 9, 1, '2024-07-31 06:11:01', '2024-07-31 09:48:54'),
(8, 'TV', '', '', 2, 1, '2024-08-05 06:59:47', '2024-08-05 06:59:47');

-- --------------------------------------------------------

--
-- Table structure for table `product_attributes_mapping`
--

CREATE TABLE `product_attributes_mapping` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `attribute_value_name` varchar(25) NOT NULL,
  `is_sub_attribute` tinyint(1) DEFAULT 0,
  `sub_attribute_heading` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_attributes_mapping`
--

INSERT INTO `product_attributes_mapping` (`id`, `product_id`, `attribute_id`, `attribute_value_name`, `is_sub_attribute`, `sub_attribute_heading`) VALUES
(1, 1, 1, 'Waste Bin', 0, NULL),
(2, 1, 1, 'Garbage bag', 0, NULL),
(3, 1, 2, 'Fornasetti', 0, NULL),
(4, 1, 2, 'Rotho', 0, NULL),
(5, 1, 2, 'Fornasetti', 0, NULL),
(6, 1, 2, 'Cartel', 0, NULL),
(7, 1, 3, 'Aluminum', 0, NULL),
(8, 1, 3, 'Brass', 0, NULL),
(9, 1, 3, 'Teak Wood', 0, NULL),
(10, 1, 3, 'Plastic', 0, NULL),
(11, 2, 4, 'Dash cam', 0, NULL),
(12, 2, 4, 'Wildlife camera', 0, NULL),
(13, 2, 4, 'FPV camera', 0, NULL),
(14, 2, 4, 'Other', 0, NULL),
(15, 2, 5, 'Huawei', 0, NULL),
(16, 2, 5, 'JVC', 0, NULL),
(17, 2, 5, 'drift', 0, NULL),
(18, 2, 5, 'Denver', 0, NULL),
(19, 2, 6, 'All colors', 0, NULL),
(20, 3, 7, 'Audio CD recorder', 0, NULL),
(21, 3, 7, 'CD burner', 0, NULL),
(22, 3, 7, 'DVD burner', 0, NULL),
(23, 3, 7, 'DVD recorder', 0, NULL),
(24, 3, 7, 'Cassette recorder', 0, NULL),
(25, 3, 7, 'Language translator', 0, NULL),
(26, 3, 7, 'Cassette recorder', 0, NULL),
(27, 3, 7, 'Answering machine', 0, NULL),
(28, 3, 7, 'VHS recorders', 0, NULL),
(29, 3, 7, 'Unknown/Other', 0, NULL),
(30, 3, 8, 'Aiwa', 0, NULL),
(31, 3, 8, 'Akai', 0, NULL),
(32, 4, 9, 'Center speaker', 0, NULL),
(33, 4, 9, 'hands-free device', 0, NULL),
(34, 4, 9, 'Car speakers', 0, NULL),
(35, 4, 9, 'Car subwoofer', 0, NULL),
(36, 4, 9, 'Bluetooth speaker', 0, NULL),
(37, 4, 9, 'Stage monitor', 0, NULL),
(38, 4, 10, 'Accuphase', 0, NULL),
(39, 4, 10, 'Acer', 0, NULL),
(40, 4, 10, 'ACRI', 0, NULL),
(41, 4, 10, 'Dell', 0, NULL),
(42, 4, 11, 'Mobile', 1, 'Model'),
(43, 4, 11, 'iPod', 0, NULL),
(44, 4, 11, 'Laptop', 1, 'Model'),
(45, 5, 12, 'Ancient Bible', 0, NULL),
(46, 5, 12, 'Antique book', 0, NULL),
(47, 5, 12, 'Picture book', 0, NULL),
(48, 5, 13, 'English', 0, NULL),
(49, 5, 13, 'Italian', 0, NULL),
(50, 5, 13, 'German', 0, NULL),
(51, 5, 14, 'Any Country', 0, NULL),
(52, 6, 15, 'All-in-one PC', 0, NULL),
(53, 6, 15, 'Antique computer', 0, NULL),
(54, 6, 15, 'Gaming PC', 0, NULL),
(55, 6, 15, 'Mini PC', 0, NULL),
(56, 6, 16, 'Acer', 1, 'Model'),
(57, 6, 16, 'Apple', 1, 'Model'),
(58, 6, 16, 'Dell', 1, 'Model'),
(59, 6, 16, 'Lenovo', 1, 'Model'),
(60, 6, 17, '3TB', 0, NULL),
(61, 6, 17, '2TB', 0, NULL),
(62, 6, 17, '1TB', 0, NULL),
(63, 6, 17, '500GB', 0, NULL),
(64, 6, 18, 'Over 24 months', 0, NULL),
(65, 6, 18, 'Up to 24 months', 0, NULL),
(66, 6, 18, 'Up to 12 months', 0, NULL),
(67, 7, 19, 'Aston Martin', 1, 'Model'),
(68, 7, 19, 'Audi', 1, 'Model'),
(69, 7, 19, 'Bentley', 1, 'Model'),
(70, 7, 19, 'Renault', 1, 'Model'),
(71, 7, 20, 'Petrol', 0, NULL),
(72, 7, 20, 'Diesel', 0, NULL),
(73, 7, 20, 'Electric', 0, NULL),
(74, 7, 20, 'Gas', 0, NULL),
(75, 7, 21, 'Convertible', 0, NULL),
(76, 7, 21, 'Combi', 0, NULL),
(77, 7, 21, 'Sedan / small car', 0, NULL),
(78, 7, 21, 'SUV / off-road-vehicle', 0, NULL),
(79, 7, 22, 'Manual transmission', 0, NULL),
(80, 7, 22, 'Machine', 0, NULL),
(81, 7, 23, 'Any', 0, NULL),
(82, 7, 24, 'Any', 0, NULL),
(83, 7, 25, 'Any', 0, NULL),
(84, 7, 26, 'Any', 0, NULL),
(85, 7, 27, 'Any', 0, NULL),
(86, 7, 28, 'Any', 0, NULL),
(87, 8, 29, '3D TV', 0, NULL),
(88, 8, 29, '4kTVs', 0, NULL),
(89, 8, 29, 'LCD TV', 0, NULL),
(90, 8, 29, 'Smart TV', 0, NULL),
(91, 8, 30, 'Any', 0, NULL),
(92, 8, 31, 'Amazon', 0, NULL),
(93, 8, 31, 'Asus', 0, NULL),
(94, 8, 31, 'Hitachi', 0, NULL),
(95, 8, 31, 'Hitachi', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_type_attribute`
--

CREATE TABLE `product_type_attribute` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `attribute_name` varchar(20) NOT NULL,
  `heading` varchar(255) NOT NULL,
  `input_type` varchar(20) NOT NULL,
  `validation` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_type_attribute`
--

INSERT INTO `product_type_attribute` (`id`, `product_id`, `category_id`, `attribute_name`, `heading`, `input_type`, `validation`, `created_at`, `updated_at`) VALUES
(1, 1, 14, 'Type', 'Product Type', 'select', 1, '2024-07-12 15:43:11', '2024-07-12 16:43:26'),
(2, 1, 14, 'Brand', 'Brand', 'select', 0, '2024-07-12 15:54:20', '2024-07-12 16:43:34'),
(3, 1, 14, 'Material Option', 'Material Option', 'select', 0, '2024-07-12 15:58:48', '2024-07-12 16:43:38'),
(4, 2, 6, 'Type', 'Action cam Type', 'select', 1, '2024-07-12 16:07:37', '2024-08-02 07:43:32'),
(5, 2, 6, 'Brand', 'Brand', 'select', 0, '2024-07-12 16:11:42', '2024-07-12 16:43:45'),
(6, 2, 6, 'Color', 'Color', 'checkbox', 0, '2024-07-12 16:11:42', '2024-07-12 16:43:48'),
(7, 3, 2, 'Type', 'Recorder Type', 'select', 1, '2024-07-31 07:11:22', '2024-07-31 07:11:22'),
(8, 3, 2, 'Brand', 'Brand', 'select', 0, '2024-07-31 07:12:18', '2024-07-31 07:12:18'),
(9, 4, 2, 'Type', 'Speaker Type', 'select', 1, '2024-07-31 07:28:56', '2024-07-31 07:28:56'),
(10, 4, 2, 'Brand', 'Brand', 'select', 0, '2024-07-31 07:28:56', '2024-07-31 07:28:56'),
(11, 4, 2, 'Compatibility', 'Compatibility', 'select', 0, '2024-07-31 07:30:09', '2024-07-31 07:30:09'),
(12, 5, 4, 'Type', 'Book Type', 'select', 1, '2024-07-31 08:21:59', '2024-07-31 08:21:59'),
(13, 5, 4, 'Miscellaneous', 'Language', 'select', 0, '2024-07-31 08:21:59', '2024-07-31 11:41:57'),
(14, 5, 4, 'Country', 'Country', 'select', 0, '2024-07-31 08:21:59', '2024-07-31 08:21:59'),
(15, 6, 8, 'Type', 'Computer Type', 'select', 1, '2024-07-31 09:31:18', '2024-07-31 09:31:18'),
(16, 6, 8, 'Brand', 'Brand', 'select', 0, '2024-07-31 09:31:18', '2024-07-31 09:31:18'),
(17, 6, 8, 'Miscellaneous', 'Storage capacity', 'select', 0, '2024-07-31 09:31:18', '2024-07-31 11:42:04'),
(18, 6, 8, 'Miscellaneous', 'Warranty', 'select', 0, '2024-07-31 09:32:25', '2024-07-31 09:32:25'),
(19, 7, 9, 'Brand', 'Brand', 'select', 0, '2024-07-31 10:00:07', '2024-07-31 10:00:07'),
(20, 7, 9, 'Miscellaneous', 'Fuel', 'select', 0, '2024-07-31 10:00:07', '2024-07-31 10:00:07'),
(21, 7, 9, 'Miscelleneous', 'Structure', 'select', 0, '2024-07-31 10:00:07', '2024-07-31 10:00:07'),
(22, 7, 9, 'Miscellaneous', 'Gearbox type', 'select', 0, '2024-07-31 10:00:07', '2024-07-31 10:00:07'),
(23, 7, 9, 'Miscellaneous', 'Kilometers', 'input', 0, '2024-07-31 10:00:07', '2024-07-31 10:00:07'),
(24, 7, 9, 'Miscellaneous', 'First registration date', 'input date', 0, '2024-07-31 10:00:07', '2024-07-31 11:52:35'),
(26, 7, 9, 'Miscellaneous', 'Last MFK date', 'input date', 0, '2024-07-31 10:00:07', '2024-07-31 11:52:40'),
(28, 7, 9, 'Color', 'Color', 'checkbox', 0, '2024-07-31 10:19:06', '2024-07-31 10:19:06'),
(29, 8, 2, 'Type', 'TV Type', 'select', 1, '2024-08-05 07:01:43', '2024-08-05 07:01:43'),
(30, 8, 2, 'Miscellaneous', 'Screen Size Diagonal', 'input', 1, '2024-08-05 07:01:43', '2024-08-05 07:01:43'),
(31, 8, 2, 'Brand', 'Brand', 'select', 0, '2024-08-05 07:07:43', '2024-08-05 07:07:43');

-- --------------------------------------------------------

--
-- Table structure for table `role_types`
--

CREATE TABLE `role_types` (
  `role_id` int(11) NOT NULL,
  `role_type` varchar(255) NOT NULL,
  `role_description` varchar(255) NOT NULL,
  `role_sub_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_types`
--

INSERT INTO `role_types` (`role_id`, `role_type`, `role_description`, `role_sub_type`) VALUES
(1, 'Buyer', 'Bidder who bids on the Products', 'BU'),
(2, 'Seller', 'One who sells the Product', 'SE'),
(3, 'Admin', 'Admin', 'AD');

-- --------------------------------------------------------

--
-- Table structure for table `sub_attribute_mapping`
--

CREATE TABLE `sub_attribute_mapping` (
  `id` int(11) NOT NULL,
  `attribute_mapping_id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_attribute_mapping`
--

INSERT INTO `sub_attribute_mapping` (`id`, `attribute_mapping_id`, `value`) VALUES
(1, 42, 'Apple iPhone 11 '),
(2, 42, 'Apple iPhone 11 Pro'),
(3, 42, 'One Plus 10'),
(4, 42, 'One Plus 7'),
(5, 44, 'Apple MacBook'),
(6, 44, 'Apple MacBook Air'),
(7, 44, 'Lenovo IdeaPad'),
(8, 56, 'Other'),
(9, 57, 'Mac Studio'),
(10, 57, 'Mac Mini'),
(11, 57, 'Mac Pro'),
(12, 58, 'Inspiron'),
(13, 58, 'Precision'),
(14, 59, 'Other'),
(15, 67, 'Db11'),
(16, 67, 'DB7'),
(17, 67, 'Rapid'),
(18, 67, 'V8/V12'),
(19, 68, 'A4'),
(20, 68, 'Q5/SQ5'),
(21, 68, 'A8/S8'),
(22, 69, 'Arnage'),
(23, 69, 'Brooklands'),
(24, 69, 'Continental'),
(25, 69, 'Mulsanne'),
(26, 70, 'Alaskan'),
(27, 70, 'Capture'),
(28, 70, 'Space'),
(29, 70, 'Megane');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `prefix` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL DEFAULT '0',
  `last_name` varchar(255) NOT NULL DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL DEFAULT '0',
  `verify_user` int(11) NOT NULL DEFAULT 0,
  `company` varchar(255) DEFAULT NULL,
  `company_reg_no` varchar(255) DEFAULT NULL,
  `signing_authority` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 0,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `login_status` int(11) NOT NULL DEFAULT 0,
  `act_token` varchar(255) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `prefix`, `first_name`, `last_name`, `email`, `password`, `phone_number`, `verify_user`, `company`, `company_reg_no`, `signing_authority`, `token`, `role_id`, `address`, `city`, `postal_code`, `location`, `state`, `country`, `login_status`, `act_token`, `created_at`, `update_at`, `status`) VALUES
(9, '', 'Aishwarya', 'Holkar', 'aishwarya.holkar@gmail.com', '$2b$10$tiRIaBX11jXBzV8LL7g8wuTKsORP5h2EJSj3YlUD2U6HUlD0B99wy', '9923448345', 1, 'CTI', '3434221213', 'D', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJpYXQiOjE3MjExMzMyNjcsImV4cCI6MTcyMTIxOTY2N30.PopCM2zdX3MytSPPqdt23Bj4-RGUd8BX1GiwGfxaBPI', 1, 'Manik Baugh Road 5656 ', 'Indore ', '452001', 'Indore', 'Madhya Pradesh', 'India', 1, '', '2024-07-16 17:57:49', '2024-07-16 17:57:49', '1'),
(10, '', 'Gannon', 'Davenport', 'farazxadrian@mailinator.com', '$2b$10$/KbECsX77eeGRwPENKX1zOukN3gysNIKFRV6X/CX2ZIhvfZsfNo7.', '35645645', 1, 'Cti', 'NA', '5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiaWF0IjoxNzI0MTU4MDQ2LCJleHAiOjE3MjQyNDQ0NDZ9.gijRBzwlomkYt7iGMf9u9Gk_sEU8tiAEjsN8anqDCOA', 1, '202 palasia Indore', 'Indore', '4520002', 'Indore', 'MP', 'India', 1, '', '2024-07-17 19:27:49', '2024-07-17 19:27:49', '1'),
(11, '', 'Mohd', 'Faraz', 'mohdfaraz.ctinfotech@gmail.com', '$2b$10$qFnVk0UrGYwc9aQi7LFJteWLCXnFlHPUaYYTwirFUChrhLVqX.Ei2', '35645645', 1, 'Cti', 'NA', '5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMSwiaWF0IjoxNzI3MzU5OTA4LCJleHAiOjE3Mjc0NDYzMDh9.xfAMG1iak81C2roFvsNcvfOTNW2C4yYB4zDx6zMxT3E', 1, '202 palasia Indore', 'Indore', '4520002', 'Indore', 'MP', 'India', 1, '', '2024-07-17 19:29:13', '2024-07-17 19:29:13', '1'),
(12, NULL, 'Charls', 'Test', 'Charls@mailinator.com', '$2b$10$jmxNtrqa3D6hjivB0SYEV.L9GHBWhUyNmKEu4LlEA0bf2Kzy6Wlvu', '1300013000', 0, 'CTI', 'NA', '123123', NULL, 1, 'UAE', 'Amsterdam', '15201', 'USA', '78541', 'India', 1, '29360737', '2024-07-26 15:09:57', '2024-07-26 15:09:57', '1'),
(13, NULL, 'John', 'Test', 'john@mailinator.com', '$2b$10$FpAgXRc.WENAneS0TYvIT.V.gyaxs8eGnRJSu4paCa88aNO380PlK', '78557855', 0, 'm,bhjvv', 'NA', 'NA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywiaWF0IjoxNzIyMjI5NjQyLCJleHAiOjE3MjIzMTYwNDJ9.PtfwyRLcWRF2tTqUP09KMP7YO5XdOA8Kyol5a-qe3Io', 1, 'UAE', 'Amsterdam', '15201', 'jhghj', '78541', 'India', 1, '', '2024-07-26 13:20:36', '2024-07-26 13:20:36', '1'),
(14, NULL, 'Jenny', 'Rosen', 'Jenny@yopmail.com', '$2b$10$CLpM2aDu3ztubwMhocXOg.7m6VPZ.cBBEhDs/m4ScG7rOIC1JftEe', '214214124214', 0, 'test', 'test', 'test', NULL, 1, 'test', 'Sydney', '113123', 'test', 'Victoria', 'India', 1, '', '2024-07-26 13:37:08', '2024-07-26 13:37:08', '1'),
(15, NULL, 'jaswinder', 'khatik', 'jaswinderkhatik@gmail.com', '$2b$10$08E9oX0v7GCY0CM.63OVw.uwlTZHPYOhtxFEpOjN.M1NEROPGmqpa', '8948676854156', 0, 'Boombshell', '498498786', '41498648946', NULL, 1, 'rajesh nagar ', 'dewas', '453001', 'dewas', 'madhya pradesh', 'india', 1, '92312478', '2024-07-26 15:14:22', '2024-07-26 15:14:22', '1'),
(16, NULL, 'jaswinder', 'khatik', 'jaswinderkhatik@yopmail.com', '$2b$10$UbeEJTGUt4HXMB9pl2tFh.KhacgjHhnCW1bjMFHMyeuGYAtTJFaUa', '54684874647', 0, 'boomshell', '448484849', '6546454545+6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNiwiaWF0IjoxNzIyMDA4Njg1LCJleHAiOjE3MjIwOTUwODV9.brELr8YkWxz_qpXVd296mM_nDJlJjdz0QsLIx0dI8Oc', 1, 'rajesh nagar', 'indore', '453001', 'dewas', 'madhya pradesh', 'india ', 1, '', '2024-07-26 15:25:00', '2024-07-26 15:25:00', '1'),
(17, NULL, 'Alan ', 'Clove', 'alan1@mailinator.com', '$2b$10$.RDYtXzYlJk4ffun/AjsI.dtqvtB3eW2ONUdodPGtTS1s6f95HCEO', '1600016000', 0, 'Rado', '1001', '10001', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNywiaWF0IjoxNzIyMjI5MzgxLCJleHAiOjE3MjIzMTU3ODF9.ACY6bm4yUF9GW3WyfB_edm-EHJkNtkm9k9Pei6Ll8hE', 1, 'UAE', 'Amsterdam', '0', 'UAE, GAZA', '78541', 'USA ', 1, '', '2024-07-29 04:55:11', '2024-07-29 04:55:11', '1'),
(20, NULL, 'palash', 'jain', 'palashjain.ctinfotech@gmail.com', '$2b$10$SWlmdHqZRDV2C6sMaWlpB.CvTUK0KeTZk5/qfqX9/8RlCgxt3llDy', '434645657', 0, 'cti', 'NA', 'NA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMCwiaWF0IjoxNzI3MzU1MDg0LCJleHAiOjE3Mjc0NDE0ODR9.PlAlSvO7_8UYufELydgwzrEBuCfhK4pRKz3a_BC0D78', 1, '202 palasia Indore', 'Indore', '4520002', 'indore', 'MP', 'India', 1, '', '2024-08-20 14:14:55', '2024-08-20 14:14:55', '1'),
(22, NULL, 'aarif', 'khan', 'aarif.ctinfotech@gmail.com', '$2b$10$fJv.Q48h10O/mlh/D21SEuzqkMQJ2EXc5ciUh6zUwtOpYiVYLFNeW', '3543657', 0, 'cti', 'NA', 'NA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMiwiaWF0IjoxNzI3MzU2NjM1LCJleHAiOjE3Mjc0NDMwMzV9.6of4gg-N3bDsX5qiLXX7Jt6UUFoc3SrjW1jjzEj9cCI', 1, '202 palasia Indore', 'Indore', '4520002', 'indore', 'MP', 'India', 1, '', '2024-08-20 15:07:45', '2024-08-20 15:07:45', '1');

-- --------------------------------------------------------

--
-- Table structure for table `user_bids`
--

CREATE TABLE `user_bids` (
  `offer_id` int(11) NOT NULL,
  `bid` decimal(20,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `max_price` decimal(20,2) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_bid` decimal(20,3) NOT NULL DEFAULT 0.000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_bids`
--

INSERT INTO `user_bids` (`offer_id`, `bid`, `user_id`, `product_id`, `max_price`, `created_at`, `updated_at`, `last_bid`) VALUES
(1, 1320.00, 20, 2, 1500.00, '2024-09-24 13:58:24', '2024-09-25 07:51:17', 1200.000),
(1, 1300.00, 22, 2, 1500.00, '2024-09-24 14:00:31', '2024-09-24 14:00:31', 0.000),
(2, 330.00, 11, 8, 1500.00, '2024-09-25 10:36:39', '2024-09-26 09:54:12', 250.000),
(2, 300.00, 20, 8, 1500.00, '2024-09-25 11:06:47', '2024-09-25 11:06:47', 0.000),
(7, 4000.00, 20, 7, 9000.00, '2024-09-26 18:21:40', '2024-09-26 18:21:40', 0.000);

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

CREATE TABLE `user_profile` (
  `user_id` int(11) NOT NULL,
  `profile_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`user_id`, `profile_name`, `address`, `city`, `state`, `country`) VALUES
(1, 'Aishwarya', '78 Pratap nagar Manika Baugh Road 452004', 'Indore', 'Madhya Pradesh', 'india');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buy_sell_transactions`
--
ALTER TABLE `buy_sell_transactions`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favourites_offer`
--
ALTER TABLE `favourites_offer`
  ADD PRIMARY KEY (`user_id`,`offer_id`);

--
-- Indexes for table `offers_created`
--
ALTER TABLE `offers_created`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offer_condition_mapping`
--
ALTER TABLE `offer_condition_mapping`
  ADD PRIMARY KEY (`offer_id`,`condition_id`,`product_id`);

--
-- Indexes for table `offer_images`
--
ALTER TABLE `offer_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offer_proattr_mapping`
--
ALTER TABLE `offer_proattr_mapping`
  ADD PRIMARY KEY (`offer_id`,`attribute_id`,`product_id`);

--
-- Indexes for table `price_suggestion`
--
ALTER TABLE `price_suggestion`
  ADD PRIMARY KEY (`offer_id`,`seller_id`,`buyer_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_attributes_mapping`
--
ALTER TABLE `product_attributes_mapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_type_attribute`
--
ALTER TABLE `product_type_attribute`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_types`
--
ALTER TABLE `role_types`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `sub_attribute_mapping`
--
ALTER TABLE `sub_attribute_mapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_bids`
--
ALTER TABLE `user_bids`
  ADD PRIMARY KEY (`offer_id`,`user_id`,`product_id`);

--
-- Indexes for table `user_profile`
--
ALTER TABLE `user_profile`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `offers_created`
--
ALTER TABLE `offers_created`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `offer_images`
--
ALTER TABLE `offer_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product_attributes_mapping`
--
ALTER TABLE `product_attributes_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `product_type_attribute`
--
ALTER TABLE `product_type_attribute`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `sub_attribute_mapping`
--
ALTER TABLE `sub_attribute_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
