/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2023 Yegor Bugayenko
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package org.eolang;

import com.jcabi.log.Logger;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.cactoos.Input;
import org.cactoos.io.InputOf;
import org.cactoos.text.TextOf;

/**
 * Save a file operation.
 *
 * @since 0.1
 */
public final class Save {

    /**
     * Content.
     */
    private final String content;

    /**
     * Path.
     */
    private final Path path;

    /**
     * Ctor.
     * @param input The input
     * @param file File to save to
     * @throws IOException If fails
     */
    public Save(final InputStream input, final Path file) throws IOException, Exception {
        this(new InputOf(input), file);
    }

    /**
     * Ctor.
     * @param input The input
     * @param file File to save to
     * @throws IOException If fails
     */
    public Save(final Input input, final Path file) throws IOException, Exception {
        this(new TextOf(input).asString(), file);
    }

    /**
     * Ctor.
     *
     * @param txt The content
     * @param file The path
     */
    public Save(final String txt, final Path file) {
        this.content = txt;
        this.path = file;
    }

    /**
     * Save the file to the path.
     *
     * @throws IOException If fails
     */
    public void save() throws IOException {
        final File dir = this.path.toFile().getParentFile();
        if (dir.mkdirs()) {
            Logger.debug(Save.class, "%s directory created", dir);
        }
        final byte[] bytes = this.content.getBytes();
        Files.write(this.path, bytes);
        Logger.info(this, "File %s saved (%d bytes)", this.path, bytes.length);
    }

}
