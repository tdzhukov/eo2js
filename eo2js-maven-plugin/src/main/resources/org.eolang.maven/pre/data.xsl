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
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" id="pre-data" version="2.0">
  <xsl:strip-space elements="*"/>
  <xsl:template match="o[@data]">
    <xsl:variable name="o" select="."/>
    <xsl:copy>
      <xsl:apply-templates select="@* except @data"/>
      <xsl:element name="value">
        <xsl:attribute name="javascript-type">
          <xsl:choose>
            <xsl:when test="@data='string'">
              <xsl:text>ElegantString</xsl:text>
            </xsl:when>
            <xsl:when test="@data='regex'">
              <xsl:text>Regex</xsl:text>
            </xsl:when>
            <xsl:when test="@data='char'">
              <xsl:text>ElegantString</xsl:text>
            </xsl:when>
            <xsl:when test="@data='float'">
              <xsl:text>ElegantNumber</xsl:text>
            </xsl:when>
            <xsl:when test="@data='bytes'">
              <xsl:choose>
                <xsl:when test="ends-with(@base, 'int')">
                  <xsl:text>ElegantInt</xsl:text>
                </xsl:when>
                <xsl:when test="ends-with(@base, 'float')">
                  <xsl:text>ElegantFloat</xsl:text>
                </xsl:when>
                <xsl:when test="ends-with(@base, 'string')">
                  <xsl:text>ElegantString</xsl:text>
                </xsl:when>
              </xsl:choose>
            </xsl:when>
            <xsl:when test="@data='tuple'">
              <xsl:text>ElegantArray</xsl:text>
            </xsl:when>
            <xsl:when test="@data='int'">
              <xsl:text>ElegantNumber</xsl:text>
            </xsl:when>
            <xsl:when test="@data='bool'">
              <xsl:text>ElegantBoolean</xsl:text>
            </xsl:when>
            <xsl:otherwise>
              <xsl:message terminate="yes">
                <xsl:text>Unknown data type "</xsl:text>
                <xsl:value-of select="@data"/>
                <xsl:text>"</xsl:text>
              </xsl:message>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:attribute>
        <xsl:choose>
          <xsl:when test="@data='string'">
            <xsl:text>"</xsl:text>
            <xsl:value-of select="text()"/>
            <xsl:text>"</xsl:text>
          </xsl:when>
          <xsl:when test="@data='regex'">
            <xsl:text>re.compile("</xsl:text>
            <xsl:value-of select="text()"/>
            <xsl:text>"</xsl:text>
            <xsl:for-each select="string-to-codepoints(@flags)">
              <xsl:if test="position() = 1">
                <xsl:text>, </xsl:text>
              </xsl:if>
              <xsl:if test="position() &gt; 1">
                <xsl:text> | </xsl:text>
              </xsl:if>
              <xsl:variable name="flag" select="codepoints-to-string(.)"/>
              <xsl:text>re.Pattern.</xsl:text>
              <xsl:choose>
                <xsl:when test="$flag='i'">
                  <xsl:text>CASE_INSENSITIVE</xsl:text>
                </xsl:when>
                <xsl:when test="$flag='m'">
                  <xsl:text>MULTILINE</xsl:text>
                </xsl:when>
                <xsl:when test="$flag='a'">
                  <xsl:text>DOTALL</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:message terminate="yes">
                    <xsl:text>Unknown flag "</xsl:text>
                    <xsl:value-of select="$flag"/>
                    <xsl:text>" in regex "</xsl:text>
                    <xsl:value-of select="$o/text()"/>
                    <xsl:text>"</xsl:text>
                  </xsl:message>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:for-each>
            <xsl:text>)</xsl:text>
          </xsl:when>
          <xsl:when test="@data='char'">
            <xsl:text>"</xsl:text>
            <xsl:value-of select="text()"/>
            <xsl:text>"</xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="text()"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:element>
    </xsl:copy>
  </xsl:template>
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
