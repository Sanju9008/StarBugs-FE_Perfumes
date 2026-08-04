package com.ecommerce.auth;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;

public class DbDump {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/ecommerce_db?serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "Sanju@2004";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {

            System.out.println("CATEGORIES:");
            ResultSet rs = stmt.executeQuery("SELECT * FROM categories");
            while (rs.next()) {
                System.out.println(rs.getLong("category_id") + " - " + rs.getString("category_name"));
            }
            
            System.out.println("\nPRODUCTS:");
            rs = stmt.executeQuery("SELECT product_id, name, price, category_id FROM products");
            while (rs.next()) {
                System.out.println(rs.getLong("product_id") + " - " + rs.getString("name") + " - " + rs.getDouble("price") + " - cat:" + rs.getLong("category_id"));
            }
            
            System.out.println("\nIMAGES:");
            rs = stmt.executeQuery("SELECT image_id, product_id, image_url FROM productimages");
            while (rs.next()) {
                System.out.println(rs.getLong("image_id") + " - prod:" + rs.getLong("product_id") + " - url length:" + (rs.getString("image_url") != null ? rs.getString("image_url").length() : "null"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
