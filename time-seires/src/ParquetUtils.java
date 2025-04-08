import org.apache.parquet.hadoop.ParquetReader;
import org.apache.parquet.avro.AvroParquetReader;
import org.apache.avro.generic.GenericRecord;
import org.apache.hadoop.fs.Path;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ParquetUtils {
    public static List<String> readParquet(String filePath) {
        List<String> rows = new ArrayList<>();

        try (ParquetReader<GenericRecord> reader = AvroParquetReader.<GenericRecord>builder(new Path(filePath)).build()) {
            GenericRecord record;
            while ((record = reader.read()) != null) {
                rows.add(record.toString());
            }
        } catch (IOException e) {
            System.err.println("Error reading Parquet file: " + e.getMessage());
        }

        return rows;
    }
}