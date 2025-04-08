import java.io.*;
import java.util.*;

public class Section4 {
    public static void main(String[] args) {

        if (args.length < 1) {
            System.out.println("Please provide a file path.");
            return;
        }
        String filePath = args[0];

        String fileExtension = getFileExtension(new File(filePath));
        System.out.println(fileExtension);

        if ("csv".equalsIgnoreCase(fileExtension)) {
            Section2.main(args); // מפעילים את main של SECTION2 אם הסיומת היא CSV
        } else if ("parquet".equalsIgnoreCase(fileExtension)) {
            Section1.main(args); // מפעילים את main של SECTION1 אם הסיומת היא Parquet
        } else {
            System.out.println("Unsupported file format.");
        }
    }

    private static String getFileExtension(File file) {
        String fileName = file.getName();
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1) {
            return ""; // אין סיומת
        }
        return fileName.substring(dotIndex + 1);
    }

}


