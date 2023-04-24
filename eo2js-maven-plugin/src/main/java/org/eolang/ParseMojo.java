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
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.util.HashSet;
import java.util.Set;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.plugins.annotations.ResolutionScope;
import org.cactoos.io.InputOf;
import org.cactoos.io.OutputTo;
import org.cactoos.set.SetOf;
import org.eolang.parser.Syntax;
import org.slf4j.impl.StaticLoggerBinder;

/**
 * Parse EO to XML.
 *
 * @since 0.1
 * @checkstyle ClassDataAbstractionCouplingCheck (500 lines)
 */
@Mojo(
        name = "parse",
        defaultPhase = LifecyclePhase.GENERATE_SOURCES,
        threadSafe = true,
        requiresDependencyResolution = ResolutionScope.COMPILE
)
@SuppressWarnings("PMD.ImmutableField")
public final class ParseMojo extends AbstractMojo {

    /**
     * Target directory.
     * @checkstyle MemberNameCheck (7 lines)
     */
    @Parameter(
            required = true,
            defaultValue = "${project.build.directory}/eo"
    )
    private File targetDir;

    /**
     * Directory in which .eo files are located.
     * @checkstyle MemberNameCheck (7 lines)
     */
    @Parameter(
            required = true,
            defaultValue = "${project.basedir}/src/main/eo"
    )
    private File sourcesDir;

    /**
     * List of inclusion GLOB filters for finding EO files.
     */
    @Parameter
    private Set<String> includes = new SetOf<>("**/*.eo");

    /**
     * List of exclusion GLOB filters for finding EO files.
     */
    @Parameter
    private Set<String> excludes = new HashSet<>(0);

    @Override
    public void execute() throws MojoFailureException {
        StaticLoggerBinder.getSingleton().setMavenLog(this.getLog());
        try {
            Files.walk(this.sourcesDir.toPath())
                    .filter(file -> !file.toFile().isDirectory())
                    .filter(
                            file -> this.includes.stream().anyMatch(
                                    glob -> ParseMojo.matcher(glob).matches(file)
                            )
                    )
                    .filter(
                            file -> this.excludes.stream().noneMatch(
                                    glob -> ParseMojo.matcher(glob).matches(file)
                            )
                    )
                    .forEach(this::parse);
        } catch (final IOException ex) {
            throw new MojoFailureException(
                    String.format(
                            "Can't list EO files in %s",
                            this.sourcesDir
                    ),
                    ex
            );
        }
    }

    /**
     * Create glob matcher from text.
     * @param text The pattern
     * @return Matcher
     */
    private static PathMatcher matcher(final String text) {
        return FileSystems.getDefault()
                .getPathMatcher(String.format("glob:%s", text));
    }

    /**
     * Parse EO file to XML.
     * @param file EO file
     */
    private void parse(final Path file) {
        // TODO: add optimizations to the pipeline
        final String name = file.toString().substring(
                this.sourcesDir.toString().length() + 1
        );
        final String xml = String.format("%s.xml", name);
        final Path path = this.targetDir.toPath()
                .resolve("01-parse")
                .resolve(xml);
        try {
            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            new Syntax(
                    name,
                    new InputOf(file),
                    new OutputTo(baos)
            ).parse();
            new Save(baos.toString(), path).save();
        } catch (final IOException ex) {
            throw new IllegalStateException(
                    String.format(
                            "Can't parse %s into %s",
                            file, this.targetDir
                    ),
                    ex
            );
        }
        Logger.info(this, "%s parsed to %s", file, path);
    }

}