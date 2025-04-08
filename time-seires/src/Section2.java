import java.io.*;
import java.util.*;

public class Section2 {
    public static void main(String[] args) {
        // Step 1: Split the main file into smaller chunks by day
        splitFile(args[0]);

        // Step 2: Merge and average the data from all chunks
        Map<String, Double> data = mergeAvgPerHour();

        // Step 3: Print the results
        for (Map.Entry<String, Double> entry : data.entrySet()) {
            System.out.println("Hour: " + entry.getKey() + ", Average: " + entry.getValue());
        }
    }

    // Splits the input CSV file into daily chunk files (by day part of the date)
    private static void splitFile(String inputFile) {
        File inFile = new File(inputFile);

        if (!inFile.exists()) {
            System.err.println("Error opening file: " + inputFile);
            return;
        }

        // Map to store grouped data by day part
        Map<String, List<String>> groupedData = new HashMap<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(inFile))) {
            String line;
            boolean isFirstLine = true;

            // Read each line from the input file
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false; // Skip the header line
                    continue;
                }

                // Split the line by comma
                String[] parts = line.split(",");

                // Continue to the next line if the format is invalid
                if (parts.length != 2) continue;

                // Extract the day part from the date (e.g., "03" from "03/04/2024")
                String datePart = parts[0].split("/")[0];

                // Group all lines by the day part
                groupedData.computeIfAbsent(datePart, k -> new ArrayList<>()).add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        // Write each group of data into separate files
        for (Map.Entry<String, List<String>> entry : groupedData.entrySet()) {
            String fileName = "chunk_day_" + entry.getKey() + ".csv";
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
                for (String logLine : entry.getValue()) {
                    writer.write(logLine);
                    writer.newLine();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // Merges and averages data from all chunk files
    public static Map<String, Double> mergeAvgPerHour() {
        // Map to store the total counts for each hour
        Map<String, Double> totalCounts = new HashMap<>();

        // Loop through each chunk file
        for (String chunkFile : getChunkFiles()) {
            // Validate and clean the data from the chunk file
            List<String> validData = Section1.validateData(readChunkFile(chunkFile));

            // Compute averages per hour for this chunk
            Map<String, Double> chunkCounts = Section1.calculateAvgPerHour(validData);

            // Accumulate the averages for each hour across all chunk files
            for (Map.Entry<String, Double> entry : chunkCounts.entrySet()) {
                String hourKey = entry.getKey();
                Double value = entry.getValue();
                totalCounts.put(hourKey, totalCounts.getOrDefault(hourKey, 0.0) + value);
            }
        }
        return totalCounts;
    }

    // Finds all chunk files that match the "chunk_day_XX.csv" pattern
    public static List<String> getChunkFiles() {
        List<String> chunkFiles = new ArrayList<>();
        int i = 1;

        while (true) {
            String fileName;
            if (i < 10) {
                fileName = "chunk_day_0" + i + ".csv";  // Handle single-digit day files
            } else {
                fileName = "chunk_day_" + i + ".csv";   // Handle double-digit day files
            }
            File file = new File(fileName);

            if (!file.exists()) break;

            chunkFiles.add(fileName);
            i++;
        }
        return chunkFiles;
    }

    // Reads all lines from a specific chunk file
    public static List<String> readChunkFile(String chunkFile) {
        List<String> lines = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(chunkFile))) {
            String line;

            // Read each line from the chunk file
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return lines;
    }
}
