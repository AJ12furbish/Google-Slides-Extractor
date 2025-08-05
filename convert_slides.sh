#!/bin/bash
INPUT=$1
OUTPUT_DIR="converted_pdfs"

mkdir -p "$OUTPUT_DIR"

process_file () {
    FILE=$1
    BASENAME=$(basename "$FILE" .html)

    echo "Converting $BASENAME.html to PDF..."

    # Convert HTML to PDF first (preserves layout)
    wkhtmltoimage --disable-smart-width "$FILE" "/tmp/$BASENAME.png"

    # Run OCR on the PNG to extract searchable text and embed it into PDF
    tesseract "/tmp/$BASENAME.png" "$OUTPUT_DIR/$BASENAME" pdf

    echo "Saved as $OUTPUT_DIR/$BASENAME.pdf"
}

if [ -d "$INPUT" ]; then
    for FILE in "$INPUT"/*.html; do
        process_file "$FILE"
    done
elif [ -f "$INPUT" ]; then
    process_file "$INPUT"
else
    echo "Provide a valid HTML file or folder."
fi
