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
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:eo="https://www.eolang.org"
                xmlns:xs="http://www.w3.org/2001/XMLSchema" id="to-javascript" version="2.0">
    <!--    <xsl:import href="/org/eolang/parser/_datas.xsl"/>-->
    <xsl:strip-space elements="*"/>
    <xsl:output indent="no"/>
    <xsl:variable name="TAB">
        <xsl:text>    </xsl:text>
    </xsl:variable>
    <xsl:function name="eo:eol">
        <xsl:param name="tabs"/>
        <xsl:value-of select="'&#10;'"/>
        <xsl:value-of select="eo:tabs($tabs)"/>
    </xsl:function>
    <xsl:function name="eo:tabs">
        <xsl:param name="n"/>
        <xsl:for-each select="1 to $n">
            <xsl:value-of select="$TAB"/>
        </xsl:for-each>
    </xsl:function>
    <xsl:function name="eo:type-of">
        <xsl:param name="root"/>
        <xsl:param name="o"/>
        <xsl:choose>
            <xsl:when test="$o/@base and $o/@ref">
                <xsl:copy-of select="eo:type-of($root, $root//o[@name=$o/@base and @line=$o/@ref])"/>
            </xsl:when>
            <xsl:when test="not($o/@base) and not($o/@ref) and contains($o/@line, '.')">
                <xsl:copy-of
                        select="eo:type-of($root, $root//o[@line=substring-after($o/@line, '.') and @name=$o/@name])"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy-of select="$o"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    <xsl:function name="eo:class-name" as="xs:string">
        <xsl:param name="n" as="xs:string"/>
        <xsl:variable name="parts" select="tokenize($n, '\.')"/>
        <xsl:variable name="p">
            <xsl:for-each select="$parts">
                <xsl:if test="position()!=last()">
                    <xsl:value-of select="."/>
                    <xsl:text>.</xsl:text>
                </xsl:if>
            </xsl:for-each>
        </xsl:variable>
        <xsl:variable name="c">
            <xsl:choose>
                <xsl:when test="$parts[last()]">
                    <xsl:value-of select="$parts[last()]"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="$parts"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="clean" select="replace(replace(replace($c, '-', '_'), '@', 'attr__phi'), '\$', 'EO')"/>
        <xsl:value-of select="concat($p, 'EO', $clean)"/>
    </xsl:function>
    <xsl:function name="eo:attr-name" as="xs:string">
        <xsl:param name="n" as="xs:string"/>
        <xsl:choose>
            <xsl:when test="$n='@'">
                <xsl:text>_phi</xsl:text>
            </xsl:when>
            <xsl:when test="$n='^'">
                <xsl:text>_parent</xsl:text>
            </xsl:when>
            <xsl:when test="$n='$'">
                <xsl:text>_self</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="replace(concat('', $n), '-', '_')"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    <xsl:function name="eo:inner-attr-name" as="xs:string">
        <xsl:param name="n" as="xs:string"/>
        <xsl:value-of select="concat('attr_', eo:attr-name($n))"/>
    </xsl:function>
    <xsl:template match="class/@name">
        <xsl:attribute name="name">
            <xsl:value-of select="."/>
        </xsl:attribute>
        <xsl:attribute name="javascript-name">
            <xsl:value-of select="eo:class-name(.)"/>
        </xsl:attribute>
    </xsl:template>
    <xsl:template match="class">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:element name="javascript">
<!--                <xsl:apply-templates select="/program" mode="license"/>-->
<!--                <xsl:text>from eo2py.atoms import *</xsl:text>-->
                <xsl:value-of select="eo:eol(0)"/>
                <xsl:apply-templates select="." mode="body"/>
            </xsl:element>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="class" mode="body">
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text>class </xsl:text>
        <xsl:value-of select="eo:class-name(@name)"/>
        <xsl:text> extends ElegantObject {</xsl:text>
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:text>constructor(</xsl:text>
        <xsl:if test="exists(@parent)">
            <xsl:text>attr__parent</xsl:text>
        </xsl:if>
        <xsl:text>) {</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:text>super();</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:text>this.attr__self = this;</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:choose>
            <xsl:when test="exists(@parent)">
                <xsl:text>this.attr__parent = attr__parent;</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>this.attr__parent = new DataizationError();</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:if test="not(attr[@name='@'])">
            <xsl:text>this.attr__phi = new DataizationError();</xsl:text>
        </xsl:if>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:apply-templates select="attr/free" mode="assignments"/>
        <xsl:apply-templates select="attr/vararg" mode="assignment"/>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:text>this.attributes = [</xsl:text>
        <xsl:apply-templates select="attr/(free|vararg)" mode="attribute_names"/>
        <xsl:text>];</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:choose>
            <xsl:when test="attr/vararg">
                <xsl:text>this.varargs = true;</xsl:text>
            </xsl:when>
<!--            <xsl:otherwise>-->
<!--                <xsl:text>self.varargs = False</xsl:text>-->
<!--            </xsl:otherwise>-->
        </xsl:choose>
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:text>}</xsl:text>
        <xsl:value-of select="eo:eol(1)"/>
<!--        <xsl:text>def dataize(self):</xsl:text>-->
<!--        <xsl:value-of select="eo:eol(2)"/>-->
<!--        <xsl:text>return self.attr__phi.dataize()</xsl:text>-->
<!--        <xsl:value-of select="eo:eol(1)"/>-->
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:apply-templates select="." mode="ctors"/>
        <xsl:text>toString() {</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:text>return `</xsl:text>
        <xsl:value-of select="eo:class-name(@name)"/>
        <xsl:text>(</xsl:text>
        <xsl:if test="exists(@parent)">
            <xsl:text>${this.attr__parent}</xsl:text>
        </xsl:if>
        <xsl:text>)`;</xsl:text>
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:text>}</xsl:text>
        <!--<xsl:apply-templates select="class" mode="body"/>-->
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text>}</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text>Object.assign(</xsl:text>
        <xsl:value-of select="eo:class-name(@name)"/>
        <xsl:text>.prototype, ApplicationMixin);</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
    </xsl:template>
    <xsl:template match="class" mode="ctors">
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:apply-templates select="attr/bound">
            <xsl:with-param name="class" select="."/>
            <xsl:with-param name="indent">
                <xsl:value-of select="eo:tabs(1)"/>
            </xsl:with-param>
        </xsl:apply-templates>
        <!--<xsl:value-of select="eo:eol(1)"/>-->
    </xsl:template>
    <xsl:template match="attr">
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:text>this.</xsl:text>
        <xsl:value-of select="eo:attr-name(@name)"/>
        <xsl:text> = </xsl:text>
        <xsl:apply-templates select="*"/>
    </xsl:template>
    <xsl:template match="once">
        <xsl:text>new AtOnce(</xsl:text>
        <xsl:apply-templates select="*"/>
        <xsl:text>)</xsl:text>
    </xsl:template>
    <xsl:template match="free" mode="args">
        <xsl:value-of select="../@name"/>
        <xsl:text>: Object, </xsl:text>
    </xsl:template>
    <xsl:template match="free" mode="assignments">
        <xsl:text>this.</xsl:text>
        <xsl:value-of select="eo:inner-attr-name(../@name)"/>
        <xsl:text> = new DataizationError();</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
    </xsl:template>
    <xsl:template match="vararg" mode="arg">
        <xsl:text>*</xsl:text>
        <xsl:value-of select="o/@name"/>
        <xsl:text>: Object, </xsl:text>
    </xsl:template>
    <xsl:template match="vararg" mode="assignment">
        <xsl:text>this.</xsl:text>
        <xsl:value-of select="eo:inner-attr-name(o/@name)"/>
        <xsl:text> = new ElegantArray();</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
    </xsl:template>
    <xsl:template match="vararg|free" mode="attribute_names">
        <xsl:text>"</xsl:text>
        <xsl:value-of select="eo:attr-name(o/@name)"/>
        <xsl:text>", </xsl:text>
    </xsl:template>
    <xsl:template match="bound">
        <xsl:text>get </xsl:text>
        <xsl:value-of select="eo:inner-attr-name(../@name)"/>
        <xsl:text>() {</xsl:text>
        <xsl:value-of select="eo:eol(2)"/>
        <xsl:text>return </xsl:text>
        <xsl:apply-templates select="*">
            <xsl:with-param name="name" select="'ret'"/>
            <xsl:with-param name="indent">
                <xsl:value-of select="eo:tabs(3)"/>
            </xsl:with-param>
        </xsl:apply-templates>
        <xsl:text>;</xsl:text>
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:text>}</xsl:text>
        <xsl:value-of select="eo:eol(1)"/>
        <xsl:value-of select="eo:eol(1)"/>
    </xsl:template>
    <xsl:template match="array">
        <xsl:text>(new ElegantArray()</xsl:text>
        <!-- <xsl:apply-templates select="*"/> WAS THERE PREVIOUSLY -->
        <xsl:apply-templates select="." mode="application"/>
        <xsl:text>)</xsl:text>
    </xsl:template>
    <xsl:template match="o[not(@base) and @name]">
        <xsl:text>/* default */</xsl:text>
    </xsl:template>
    <xsl:template match="o[@base and not(starts-with(@base, '.'))]">
        <xsl:param name="indent"/>
        <xsl:param name="name" select="'o'"/>
        <xsl:variable name="o" select="."/>
        <xsl:variable name="b" select="//*[@name=$o/@base and @line=$o/@ref]"/>
        <!-- <xsl:if test="name(..)='o' and not(starts-with(../@base, '.'))">
            <xsl:text>.call</xsl:text>
        </xsl:if> -->
        <xsl:choose>
<!--            if self ($)-->
            <xsl:when test="@base='$'">
                <xsl:text>(this.</xsl:text>
                <xsl:value-of select="eo:inner-attr-name('_self')"/>
                <xsl:text>)</xsl:text>
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
            </xsl:when>
<!--            if parent (^)-->
            <xsl:when test="@base='^'">
                <xsl:text>(this.</xsl:text>
                <xsl:value-of select="eo:inner-attr-name('_parent')"/>
                <xsl:text>)</xsl:text>
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
            </xsl:when>
<!--            if inner class is needed to be returned as a value of a bound attribute-->
            <xsl:when test="@cut and @name">
                <xsl:text>new </xsl:text>
                <xsl:value-of select="eo:class-name($b/@name)"/>
                <xsl:text>(this)</xsl:text>
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="@cut and not(@name)">
                <xsl:text>(this.</xsl:text>
                <xsl:value-of select="eo:inner-attr-name(@base)"/>
                <xsl:text>)</xsl:text>
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
            </xsl:when>
            <!--            if a global class is applied-->
            <xsl:when test="$b and name($b)='class'">
                <xsl:text>(new </xsl:text>
                <xsl:value-of select="eo:class-name(@base)"/>
                <xsl:text>()</xsl:text>
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
                <xsl:text>)</xsl:text>
            </xsl:when>
<!--            if an attribute is applied and it is an inner object-->
            <xsl:when test="$b and *">
                <xsl:text>(this.</xsl:text>
                <xsl:value-of select="eo:inner-attr-name(@base)"/>
                <!-- <xsl:text>()</xsl:text> -->
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
                <xsl:text>)</xsl:text>
            </xsl:when>
<!--            some weird nestedness error-->
            <xsl:when test="$b/@level">
                <xsl:message terminate="yes">
                    <xsl:text>You must explicitly say "</xsl:text>
                    <xsl:for-each select="1 to $b/@level">
                        <xsl:text>^.</xsl:text>
                    </xsl:for-each>
                    <xsl:value-of select="@base"/>
                    <xsl:text>"</xsl:text>
                    <xsl:text> instead of just "</xsl:text>
                    <xsl:value-of select="@base"/>
                    <xsl:text>" on line </xsl:text>
                    <xsl:value-of select="@line"/>
                </xsl:message>
            </xsl:when>
<!--            if an attribute is referenced-->
            <xsl:when test="$b">
                <xsl:text>(this.</xsl:text>
                <xsl:value-of select="eo:inner-attr-name(@base)"/>
                <xsl:text>)</xsl:text>
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
<!--                <xsl:text></xsl:text>-->
            </xsl:when>
<!--            if an atom is applied-->
            <xsl:when test="starts-with(@base, 'org.eolang.')">
                <xsl:variable name="objName" select="tokenize(@base, '\.')[last()]"/>
                <xsl:choose>
                    <xsl:when test="not($objName = 'float' or $objName = 'string' or  $objName = 'int' or $objName = 'bool')">
                        <xsl:text>(new </xsl:text>
                        <xsl:value-of select="concat(upper-case(substring($objName, 1, 1)), substring($objName, 2))"/>
                        <xsl:text>()</xsl:text>
                        <!-- <xsl:apply-templates select="*"> WAS HERE PREVIOUSLY -->
                        <xsl:apply-templates select="." mode="application">
                            <xsl:with-param name="name" select="$name"/>
                            <xsl:with-param name="indent" select="$indent"/>
                        </xsl:apply-templates>
                        <xsl:text>)</xsl:text>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:text>(</xsl:text>
                        <xsl:apply-templates select="*">
                            <xsl:with-param name="name" select="$name"/>
                            <xsl:with-param name="indent" select="$indent"/>
                        </xsl:apply-templates>
                        <xsl:text>)</xsl:text>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
<!--            if an inner class is defined recursively-->
            <xsl:when test="ancestor::class[@name=$o/@base]">
                <xsl:text>(new </xsl:text>
                <xsl:value-of select="concat('', eo:class-name(@base))"/>
                <xsl:text>(this.attr__parent)</xsl:text>
                <!-- <xsl:apply-templates select="*"/> WAS THERE PREVIOUSLY -->
                <xsl:apply-templates select="." mode="application">
                    <xsl:with-param name="name" select="$name"/>
                    <xsl:with-param name="indent" select="$indent"/>
                </xsl:apply-templates>
                <xsl:text>)</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>(new </xsl:text>
                <xsl:value-of select="concat('', eo:class-name(@base))"/>
                <xsl:text>(</xsl:text>
                <xsl:apply-templates select="*"/>
                <xsl:text>))</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="o[starts-with(@base, '.') and *]">
        <xsl:param name="indent"/>
        <xsl:param name="name" select="'o'"/>
        <xsl:variable name="method" select="substring-after(@base, '.')"/>
        <!-- <xsl:if test="name(..)='o' and not(starts-with(../@base, '.'))">
            <xsl:text>.call</xsl:text>
        </xsl:if> -->
        <xsl:text>(new Attribute(</xsl:text>
        <xsl:apply-templates select="*[1]">
            <xsl:with-param name="name">
                <xsl:value-of select="$name"/>
                <xsl:text>_base</xsl:text>
            </xsl:with-param>
            <xsl:with-param name="indent">
                <xsl:value-of select="$indent"/>
            </xsl:with-param>
        </xsl:apply-templates>
        <xsl:text>, </xsl:text>
        <xsl:choose>
            <xsl:when test="$method='^'">
                <xsl:text>"_parent"</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>"</xsl:text>
                <xsl:value-of select="eo:attr-name($method)"/>
                <xsl:text>"</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>)</xsl:text>
        <xsl:apply-templates select="." mode="application">
            <xsl:with-param name="indent" select="$indent"/>
            <xsl:with-param name="name" select="$name"/>
            <xsl:with-param name="skip" select="1"/>
        </xsl:apply-templates>
        <xsl:text>)</xsl:text>
    </xsl:template>
    <xsl:template match="*" mode="application">
        <xsl:param name="indent" select="eo:tabs(3)"/>
        <xsl:param name="skip" select="0"/>
        <xsl:param name="name" select="'o'"/>
        <xsl:for-each select="./*[name()!='value' and position() &gt; $skip][not(@level)]">
            <xsl:text>.call</xsl:text>
            <xsl:apply-templates select=".">
                <xsl:with-param name="name" select="$name"/>
                <xsl:with-param name="indent" select="$indent"/>
            </xsl:apply-templates>
        </xsl:for-each>
        <xsl:for-each select="./*[name()!='value' and position() &gt; $skip][not(@level)]">
            <xsl:choose>
                <xsl:when test="@as">
                    <xsl:text>"</xsl:text>
                    <xsl:value-of select="@as"/>
                    <xsl:text>"</xsl:text>
                </xsl:when>
            </xsl:choose>
        </xsl:for-each>
        <xsl:apply-templates select="value">
            <xsl:with-param name="name" select="$name"/>
            <xsl:with-param name="indent" select="$indent"/>
        </xsl:apply-templates>
    </xsl:template>
    <xsl:template match="value">
        <xsl:text>(new </xsl:text>
        <xsl:value-of select="@javascript-type"/>
        <xsl:text>(</xsl:text>
        <!--<xsl:if test="@javascript-type = 'ElegantBoolean'">"</xsl:if>-->
        <xsl:value-of select="text()"/>
        <!--<xsl:if test="@javascript-type = 'ElegantBoolean'">"</xsl:if>-->
        <xsl:text>))</xsl:text>
    </xsl:template>
    <xsl:template match="meta[head='package']" mode="head">
        <xsl:text>package </xsl:text>
        <xsl:value-of select="tail"/>
        <xsl:text>;</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:value-of select="eo:eol(0)"/>
    </xsl:template>
    <xsl:template match="/program" mode="license">
        <!--        <xsl:text>#</xsl:text>-->
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text> // This file was auto-generated by eo2js-maven-plugin</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text> // on </xsl:text>
        <xsl:value-of select="current-dateTime()"/>
        <xsl:text>. Don't edit it,</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text> // your changes will be discarded on the next build.</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text> // The sources were compiled to XML on</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:text> // </xsl:text>
        <xsl:value-of select="@time"/>
        <xsl:text> // by the EO compiler v.</xsl:text>
        <xsl:value-of select="@version"/>
        <xsl:text>.</xsl:text>
        <xsl:value-of select="eo:eol(0)"/>
        <!--        <xsl:text> *</xsl:text>-->
        <xsl:value-of select="eo:eol(0)"/>
        <xsl:value-of select="eo:eol(0)"/>
    </xsl:template>
    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>