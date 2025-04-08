import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.*;

public class Section1 {
    private static final Pattern TIMESTAMP_PATTERN = Pattern.compile("^\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}$");

    public static void main(String[] args) {

        List<String> lines = ParquetUtils.readParquet(args[0]);
        if (lines == null || lines.isEmpty()) {
            System.err.println("Error: File is empty or could not be read.");
            return;
        }

        lines.remove(0); // Remove header line
        List<String> validData = validateData(lines);
        validData.forEach(System.out::println);
        System.out.println("Valid lines: " + validData.size());

        Map<String, Double> avgPerHour = calculateAvgPerHour(validData);
        System.out.println("Average per hour:");
        avgPerHour.forEach((k, v) -> System.out.println(k + " => " + v));
    }

    // Collects values into a list for each hour, then computes average
    public static Map<String, Double> calculateAvgPerHour(List<String> data) {
        Map<String, List<Double>> valuesPerHour = new HashMap<>();

        for (String line : data) {
            String[] parts = line.split(",");
            if (parts.length < 2) continue;

            String[] dateTimeParts = parts[0].split(" ");
            if (dateTimeParts.length < 2) continue;

            String date = dateTimeParts[0];
            String hour = dateTimeParts[1].split(":")[0];
            String dateHourKey = date + " " + hour;

            try {
                double value = Double.parseDouble(parts[1].trim());
                valuesPerHour.computeIfAbsent(dateHourKey, k -> new ArrayList<>()).add(value);
            } catch (NumberFormatException e) {
                System.err.println("Invalid number format: " + parts[1]);
            }
        }

        // Compute average per hour
        Map<String, Double> avgPerHour = new HashMap<>();
        for (Map.Entry<String, List<Double>> entry : valuesPerHour.entrySet()) {
            List<Double> values = entry.getValue();
            double sum = values.stream().mapToDouble(Double::doubleValue).sum();
            double average = sum / values.size();
            avgPerHour.put(entry.getKey(), average);
        }

        return avgPerHour;
    }

    public static List<String> validateData(List<String> lines) {
        Set<String> seenTimestamps = new HashSet<>();
        return lines.stream()
                .filter(line -> isValidLine(line, seenTimestamps))
                .collect(Collectors.toList());
    }

    private static boolean isValidLine(String line, Set<String> seenTimestamps) {
        if (line == null || line.trim().isEmpty()) return false;

        String[] parts = line.split(",");
        if (parts.length != 2) return false;

        String timestamp = parts[0].trim();
        String value = parts[1].trim();

        if (!TIMESTAMP_PATTERN.matcher(timestamp).matches()) return false;
        if (!value.matches("-?\\d+(\\.\\d+)?")) return false;
        if (seenTimestamps.contains(timestamp)) return false;

        seenTimestamps.add(timestamp);
        return true;
    }

    private static List<String> readFile(String filePath) {
        try {
            return Files.readAllLines(Paths.get(filePath));
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
            return null;
        }
    }
}