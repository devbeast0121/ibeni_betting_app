
import React from 'react';
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 id="privacy" className="text-xl md:text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p>At ibeni, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>
      </section>
      
      <Separator />
      
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Information We Collect</h2>
        <p><strong>Personal Information:</strong> We collect personal information that you voluntarily provide to us when you register for the Service, express interest in obtaining information about us or our products and services, or otherwise contact us. This may include name, email address, postal address, phone number, and payment information.</p>
        <p className="mt-2"><strong>Usage Information:</strong> We automatically collect certain information when you visit, use, or navigate the Service. This information may include IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Service.</p>
      </section>
      
      <Separator />
      
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p>We use the information we collect or receive to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Facilitate account creation and authentication</li>
          <li>Fulfill and manage your orders, payments, and transactions</li>
          <li>Send administrative information to you</li>
          <li>Send you marketing and promotional communications</li>
          <li>Respond to your inquiries and provide customer service</li>
          <li>Administer prize draws and competitions</li>
          <li>Deliver targeted advertising to you</li>
          <li>Protect our Services and maintain security</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>
      
      <Separator />
      
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Disclosure of Your Information</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Business partners, vendors, and third-party service providers</li>
          <li>Affiliates and subsidiaries</li>
          <li>In connection with business transactions (e.g., merger or acquisition)</li>
          <li>When required by law or to protect rights</li>
        </ul>
      </section>
      
      <Separator />
      
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Your Privacy Rights</h2>
        <p>Depending on where you live, you may have certain rights regarding your personal information, such as the right to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Access and receive a copy of your personal information</li>
          <li>Rectify or update your personal information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict our processing of your personal information</li>
          <li>Data portability</li>
        </ul>
        <p className="mt-2">To exercise these rights, please contact us at privacy@ibeni.com.</p>
      </section>
      
      <Separator />
      
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Security of Your Information</h2>
        <p>We use administrative, technical, and physical security measures designed to protect your personal information. However, despite our safeguards and efforts, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
      </section>
      
      <Separator />
      
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
