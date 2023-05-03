<?xml version="1.0"?>
<!--
The MIT License (MIT)

Copyright (c) 2016-2023 Yegor Bugayenko

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" id="pre-booleans" version="2.0">
  <xsl:strip-space elements="*"/>
  <xsl:template match="o[@base='org.eolang.true' or @base='org.eolang.false']">
    <xsl:variable name="o" select="."/>
    <xsl:variable name="current-name" select="name()"/>
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
      <xsl:attribute name="data">bool</xsl:attribute>
      <xsl:choose>
        <xsl:when test="$o[@base='org.eolang.true']">
          <xsl:text>true</xsl:text>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>false</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:copy>
  </xsl:template>
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
